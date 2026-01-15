import { Role } from '../../../core/auth/auth.types';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  status: status;
}

export type status = 'ACTIVE' | 'INACTIVE';
