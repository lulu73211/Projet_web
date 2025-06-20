import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

export const ROLES_KEY = 'roles';

/**
 * Décorateur qui définit les rôles requis pour accéder à une route
 * @param roles Liste des rôles requis
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
