/* eslint-disable @typescript-eslint/ban-types */
import { applyDecorators, CanActivate, SetMetadata, UseGuards } from '@nestjs/common';

import { PUBLIC_KEY, Role, ROLE_KEY } from '@/constants';
import { JwtAuthGuard } from '@/guards/jwt.guard';
import { RolesGuard } from '@/guards/role.guard';

export function Auth(
  roles: Role[] = [],
  options?: Partial<{ public: boolean; otherGuards: (Function | CanActivate)[] }>
): MethodDecorator {
  const isPublicRoute = options?.public;

  return applyDecorators(
    SetMetadata(PUBLIC_KEY, isPublicRoute),
    SetMetadata(ROLE_KEY, roles),
    UseGuards(JwtAuthGuard, RolesGuard, ...(options?.otherGuards || []))
  );
}
