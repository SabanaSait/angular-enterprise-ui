import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { delay, of } from 'rxjs';
import { MOCK_USERS } from './users.mock';
import { User } from '../features/users/models/user.model';
import { SortDirection, UserSortKey } from '../features/users/models/users-query.model';

export const mockBackendInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.method === 'GET' && req.url.endsWith('/api/users')) {
    const pageNumber = Number(req.params.get('pageNumber') ?? 1);
    const pageSize = Number(req.params.get('pageSize') ?? 10);
    const sortBy = req.params.get('sortBy') as UserSortKey | null;
    const sortDir = req.params.get('sortDir') as SortDirection | null;
    const start = (pageNumber - 1) * pageSize;
    const end = start + pageSize;
    const users = MOCK_USERS;

    console.log(sortBy, sortDir, 'out');
    if (sortBy && sortDir) {
      console.log(sortBy, sortDir);
      users.sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];

        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }

        return sortDir === 'asc' ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal);
      });
    }

    console.log(users, 'users array sorted!');

    const response = {
      entities: users.slice(start, end),
      pageNumber,
      pageSize,
      total: MOCK_USERS.length,
    };

    return of(
      new HttpResponse({
        status: 200,
        body: response,
      })
    ).pipe(delay(600));
  }

  return next(req);
};
