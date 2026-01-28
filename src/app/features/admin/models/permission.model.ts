import { Permission } from '../../../core/auth/auth.types';

export interface AdminPermission {
  code: Permission;
  label: string;
  description?: string;
}
