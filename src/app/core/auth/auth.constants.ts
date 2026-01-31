import { Role } from './auth.types';

export interface RoleOption {
  value: Role;
  label: string;
}

export const ROLE_OPTIONS: readonly RoleOption[] = [
  { value: 'ADMIN', label: 'Administrator' },
  { value: 'SUPERVISOR', label: 'Supervisor' },
  { value: 'USER', label: 'User' },
];
