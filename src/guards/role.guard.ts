import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import _ from 'lodash';

import { PUBLIC_KEY, Role, ROLE_KEY } from '@/constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (_.isEmpty(requiredRoles)) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();

    return requiredRoles.includes(user?.role);
  }
}
