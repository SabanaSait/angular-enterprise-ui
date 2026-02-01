import { Permission } from '../../../../core/auth/auth.types';

export interface PermissionGroup {
  key: string;
  label: string;
  permissions: Permission[];
}

export const ROLE_PERMISSION_GROUPS: PermissionGroup[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    permissions: ['VIEW_DASHBOARD'],
  },
  {
    key: 'users',
    label: 'Users',
    permissions: ['VIEW_USERS', 'MANAGE_USERS'],
  },
  {
    key: 'admin',
    label: 'Admin',
    permissions: ['VIEW_ADMIN'],
  },
  {
    key: 'roles',
    label: 'Roles',
    permissions: ['VIEW_ROLES', 'MANAGE_ROLES'],
  },
  {
    key: 'permissions',
    label: 'Permissions',
    permissions: ['VIEW_PERMISSIONS', 'MANAGE_PERMISSIONS'],
  },
];
