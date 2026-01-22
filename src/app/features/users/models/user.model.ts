import { Role } from '../../../core/auth/auth.types';

export enum UserStatus {
  Active = 'active',
  Inactive = 'inactive',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
}
