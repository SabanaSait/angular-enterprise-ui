import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { delay, of } from 'rxjs';
import { MOCK_USERS } from './users.mock';
import { SortDirection, UserSortKey } from '../features/users/models/users-query.model';
import { User } from '../features/users/models/user.model';
let usersDB: User[] = [...MOCK_USERS];

export const mockBackendInterceptor: HttpInterceptorFn = (req, next) => {
  const { method, url, params, body } = req;

  /* -------------------------------
   * GET: users list
   * /api/users
   * ------------------------------- */
  if (method === 'GET' && url.endsWith('/api/users')) {
    const pageNumber = Number(params.get('pageNumber') ?? 1);
    const pageSize = Number(params.get('pageSize') ?? 10);
    const sortBy = params.get('sortBy') as UserSortKey | null;
    const sortDir = params.get('sortDir') as SortDirection | null;

    if (sortBy && sortDir) {
      usersDB.sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];

        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }

        return sortDir === 'asc' ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal);
      });
    }

    const start = (pageNumber - 1) * pageSize;
    const end = start + pageSize;

    return of(
      new HttpResponse({
        status: 200,
        body: {
          entities: usersDB.slice(start, end),
          pageNumber,
          pageSize,
          total: usersDB.length,
        },
      }),
    ).pipe(delay(600));
  }

  /* -------------------------------
   * GET: single user
   * /api/users/:id
   * ------------------------------- */
  if (method === 'GET' && url.match(/\/api\/users\/[^/]+$/)) {
    const id = url.split('/').pop();
    const user = usersDB.find((u) => u.id === id);

    return of(
      new HttpResponse({
        status: user ? 200 : 404,
        body: user ?? null,
      }),
    ).pipe(delay(400));
  }

  /* -------------------------------
   * POST: create user
   * /api/users
   * ------------------------------- */
  if (method === 'POST' && url.endsWith('/api/users')) {
    const create = body as Omit<User, 'id'>;
    const newUser: User = {
      id: crypto.randomUUID(),
      ...create,
    };

    usersDB.unshift(newUser);

    return of(
      new HttpResponse({
        status: 201,
        body: newUser,
      }),
    ).pipe(delay(500));
  }

  /* -------------------------------
   * PUT: update user
   * /api/users/:id
   * ------------------------------- */
  if (method === 'PUT') {
    const id = (body as Partial<User>)?.id;
    const index = usersDB.findIndex((u) => u.id === id);

    if (index === -1) {
      return of(
        new HttpResponse({
          status: 404,
          body: null,
        }),
      ).pipe(delay(400));
    }

    const update = body as Partial<User>;

    usersDB[index] = {
      ...usersDB[index],
      ...update,
    };

    return of(
      new HttpResponse({
        status: 200,
        body: usersDB[index],
      }),
    ).pipe(delay(500));
  }

  /* -------------------------------
   * DELETE: remove user (optional)
   * /api/users/:id
   * ------------------------------- */
  if (method === 'DELETE' && url.match(/\/api\/users\/[^/]+$/)) {
    const id = url.split('/').pop();
    const index = usersDB.findIndex((u) => u.id === id);

    if (index !== -1) {
      usersDB.splice(index, 1);
    }

    return of(
      new HttpResponse({
        status: 204,
        body: null,
      }),
    ).pipe(delay(400));
  }

  return next(req);
};
