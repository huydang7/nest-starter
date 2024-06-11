/* eslint-disable @typescript-eslint/ban-types */
import { applyDecorators, CanActivate, SetMetadata, UseGuards } from '@nestjs/common';

import { PUBLIC_KEY, Role, ROLE_KEY } from '@/constants';
import { JwtAuthGuard } from '@/guards/jwt.guard';
import { RolesGuard } from '@/guards/role.guard';

type AuthDecoratorOptions = {
  isPublic?: boolean;
  roles?: Role[];
  otherGuards?: (Function | CanActivate)[];
};

export function Auth(options?: AuthDecoratorOptions): MethodDecorator {
  const { isPublic = false, roles = [], otherGuards = [] } = options || {};
  return applyDecorators(
    SetMetadata(PUBLIC_KEY, isPublic),
    SetMetadata(ROLE_KEY, roles),
    UseGuards(JwtAuthGuard, RolesGuard, ...(otherGuards || []))
  );
}
