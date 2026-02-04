import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpResponse } from '@angular/common/http';
import { of, delay } from 'rxjs';
import { AdminPermission } from '../features/admin/models/permission.model';
import { MOCK_PERMISSIONS } from './permissions-mock';

const permissionsDB = [...MOCK_PERMISSIONS];

export const PermissionsMockInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) => {
  const { body } = req;
  if (!req.url.startsWith('/api/admin/permissions')) {
    return next(req);
  }

  /* -------------------
   * GET: permissions list
   * /api/admin/permissions
   * ------------------- */
  if (req.method === 'GET' && req.url.endsWith('api/admin/permissions')) {
    return of(
      new HttpResponse({
        status: 200,
        body: permissionsDB,
      }),
    ).pipe(delay(400));
  }

  /* -----------------------
   * GET: single permission
   * /api/admin/permissions/:id
   * ----------------------- */
  if (req.method === 'GET') {
    const id = req.url.split('/').pop()!;
    const permission = permissionsDB.find((permission) => id === permission.id);

    return of(
      new HttpResponse({
        status: permission ? 200 : 404,
        body: permission ?? null,
      }),
    );
  }

  /* -----------------------
   * POST: create permission
   * /api/admin/permissions/
   * ----------------------- */
  if (req.method === 'POST') {
    const create = body as Omit<AdminPermission, 'id'>;
    const newPermission = {
      id: crypto.randomUUID(),
      ...create,
    };

    permissionsDB.unshift(newPermission);

    return of(
      new HttpResponse({
        status: 200,
        body: permissionsDB,
      }),
    ).pipe(delay(400));
  }

  /* -----------------------
   * PUT: update permission
   * /api/admin/permissions/:id
   * ----------------------- */
  if (req.method === 'PUT') {
    const id = req.url.split('/').pop()!;
    const index = permissionsDB.findIndex((permission) => permission.id === id);

    if (index === -1) {
      return of(
        new HttpResponse({
          status: 404,
          body: null,
        }),
      ).pipe(delay(200));
    }

    const update = body as Partial<AdminPermission>;

    permissionsDB[index] = {
      ...permissionsDB[index],
      ...update,
    };

    return of(
      new HttpResponse({
        status: 200,
        body: permissionsDB[index],
      }),
    ).pipe(delay(400));
  }

  /* -----------------------
   * DELETE: delete permission
   * /api/admin/permissions/:id
   * ----------------------- */
  if (req.method === 'DELETE') {
    const id = req.url.split('/').pop()!;
    const index = permissionsDB.findIndex((permission) => id === permission.id);

    if (index !== -1) {
      permissionsDB.splice(index, 1);
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
