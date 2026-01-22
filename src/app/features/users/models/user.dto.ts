import { Role } from '../../../core/auth/auth.types';
import { UserStatus } from './user.model';

export interface CreateUserDto {
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
}

export interface UpdateUserDto extends CreateUserDto {
  id: string;
}
