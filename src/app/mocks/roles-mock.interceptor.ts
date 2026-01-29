import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MOCK_ROLES } from './roles.mock';
import { AdminRole } from '../features/admin/models/role.model';

let rolesDB: AdminRole[] = [...MOCK_ROLES];

export const rolesMockInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  if (!req.url.startsWith('/api/admin/roles')) {
    return next(req);
  }

  /* -------------------
   * GET: roles list
   * /api/admin/roles
   * ------------------- */
  if (req.method === 'GET' && req.url.endsWith('/api/admin/roles')) {
    return of(
      new HttpResponse({
        status: 200,
        body: rolesDB,
      }),
    ).pipe(delay(400));
  }

  /* -----------------------
   * GET: single role
   * /api/admin/role/:id
   * ----------------------- */
  if (req.method === 'GET') {
    const id = req.url.split('/').pop()!;
    const role = rolesDB.find((user) => id === user.id);

    return of(
      new HttpResponse({
        status: role ? 200 : 404,
        body: role ?? null,
      }),
    );
  }
  return next(req);
};
