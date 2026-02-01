import { Permission } from '../../../core/auth/auth.types';

export interface AdminPermission {
  id: string;
  code: Permission;
  description: string;
}
