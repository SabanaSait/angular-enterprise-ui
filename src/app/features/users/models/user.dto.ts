import { Role } from '../../../core/auth/auth.types';
import { UserStatus } from './user.model';

export interface BaseUser {
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
}

export type CreateUserDto = BaseUser;

export type UpdateUserDto = Partial<BaseUser>;
