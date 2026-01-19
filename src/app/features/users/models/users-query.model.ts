import { User } from './user.model';

export type SortDirection = 'asc' | 'desc';

export type UserSortKey = keyof User;

export interface UsersQuery {
  pageNumber: number;
  pageSize: number;
  sortBy: UserSortKey;
  sortDirection: SortDirection;
}
