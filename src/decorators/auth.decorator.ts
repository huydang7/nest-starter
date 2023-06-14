import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { PublicKey, Role, RoleKey } from 'src/constants';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { RolesGuard } from 'src/guards/role.guard';

export function Auth(roles: Role[] = [], options?: Partial<{ public: boolean }>): MethodDecorator {
  const isPublicRoute = options?.public;

  return applyDecorators(
    SetMetadata(PublicKey, isPublicRoute),
    SetMetadata(RoleKey, roles),
    UseGuards(JwtAuthGuard, RolesGuard)
  );
}
