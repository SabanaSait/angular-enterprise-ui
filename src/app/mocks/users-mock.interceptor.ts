import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { delay, of } from 'rxjs';
import { MOCK_USERS } from './users.mock';

export const mockBackendInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.method === 'GET' && req.url.endsWith('/api/users')) {
    const pageNumber = Number(req.params.get('pageNumber') ?? 1);
    const pageSize = Number(req.params.get('pageSize') ?? 10);
    const start = (pageNumber - 1) * pageSize;
    const end = start + pageSize;

    const response = {
      entities: MOCK_USERS.slice(start, end),
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
