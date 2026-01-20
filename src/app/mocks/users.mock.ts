import { User, UserStatus } from '../features/users/models/user.model';

export const MOCK_USERS: User[] = Array.from({ length: 90 }).map((_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@company.com`,
  role: i % 5 === 0 ? 'ADMIN' : 'USER',
  status: i % 7 === 0 ? UserStatus.Inactive : UserStatus.Active,
}));
