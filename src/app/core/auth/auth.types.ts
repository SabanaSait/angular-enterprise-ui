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

export interface RoleOption {
  value: Role;
  label: string;
}
export interface PermissionMeta {
  label: string;
  group: string;
}

export interface PersistedUser {
  role: Role;
}
