import { Role } from '../../../core/auth/auth.types';

export enum UserStatus {
  Active = 'Active',
  Inactive = 'Inactive',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
}
