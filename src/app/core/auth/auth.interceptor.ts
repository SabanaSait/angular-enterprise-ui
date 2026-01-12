import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const authReq = auth.isAuthenticated()
    ? req.clone({
        setHeaders: {
          'X-User-Role': auth.user()?.role ?? '',
        },
      })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        auth.logout();
        router.navigateByUrl('/login');
      }
      if (error.status === 403) {
        router.navigateByUrl('/unauthorized');
      }

      return throwError(() => error);
    })
  );
};
