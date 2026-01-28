import { Role, Permission } from '../../../core/auth/auth.types';

/**
 * AdminRole extends auth Role with metadata & permissions.
 * Role codes are owned by auth domain.
 */
export interface AdminRole {
  id: string;
  code: Role;
  name: string;
  description?: string;
  permissions: Permission[];
  system: boolean;
}
