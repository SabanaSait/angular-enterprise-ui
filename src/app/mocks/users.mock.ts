import { User } from '../features/users/user.types';

export const MOCK_USERS: User[] = Array.from({ length: 42 }).map((_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  email: `user${i + 1}@company.com`,
  role: i % 5 === 0 ? 'ADMIN' : 'USER',
  status: i % 7 === 0 ? 'INACTIVE' : 'ACTIVE',
}));
