export type Role = 'ADMIN' | 'SUPERVISOR' | 'USER';

export type Permission = 'VIEW_DASHBOARD' | 'VIEW_USERS' | 'MANAGE_USERS';

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  ADMIN: ['VIEW_DASHBOARD', 'VIEW_USERS', 'MANAGE_USERS'],
  SUPERVISOR: ['VIEW_DASHBOARD', 'VIEW_USERS'],
  USER: ['VIEW_DASHBOARD'],
};

export interface PersistedUser {
  role: Role;
}
