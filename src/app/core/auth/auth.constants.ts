import { Permission, PermissionMeta, Role, RoleOption } from './auth.types';

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  ADMIN: [
    'VIEW_DASHBOARD',
    'VIEW_USERS',
    'MANAGE_USERS',
    'VIEW_ADMIN',
    'VIEW_ROLES',
    'MANAGE_ROLES',
    'VIEW_PERMISSIONS',
    'MANAGE_PERMISSIONS',
  ],
  SUPERVISOR: ['VIEW_DASHBOARD', 'VIEW_USERS'],
  USER: ['VIEW_DASHBOARD'],
};

export const ROLE_OPTIONS: readonly RoleOption[] = [
  { value: 'ADMIN', label: 'Administrator' },
  { value: 'SUPERVISOR', label: 'Supervisor' },
  { value: 'USER', label: 'User' },
];

export const PERMISSIONS_META: Record<Permission, PermissionMeta> = {
  VIEW_DASHBOARD: {
    label: 'View Dashboard',
    group: 'Dashboard',
  },
  VIEW_USERS: {
    label: 'View Users',
    group: 'Users',
  },
  MANAGE_USERS: {
    label: 'Manage Users',
    group: 'Users',
  },
  VIEW_ADMIN: {
    label: 'View Admin',
    group: 'Admin',
  },
  VIEW_ROLES: {
    label: 'View Roles',
    group: 'Roles',
  },
  MANAGE_ROLES: {
    label: 'Manage Roles',
    group: 'Roles',
  },
  VIEW_PERMISSIONS: {
    label: 'View Permissions',
    group: 'Permissions',
  },
  MANAGE_PERMISSIONS: {
    label: 'Manage Permissions',
    group: 'Permissions',
  },
};
