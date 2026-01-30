export type Role = 'ADMIN' | 'SUPERVISOR' | 'USER';

export type Permission =
  | 'VIEW_DASHBOARD'
  | 'VIEW_USERS'
  | 'MANAGE_USERS'
  | 'VIEW_ADMIN'
  | 'VIEW_ROLES'
  | 'VIEW_PERMISSIONS'
  | 'MANAGE_ROLES'
  | 'MANAGE_PERMISSIONS';

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

export interface PersistedUser {
  role: Role;
}
