import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const auth = inject(AuthService);

  const authReq = auth.isAuthenticated()
    ? req.clone({
        setHeaders: {
          'X-User-Role': auth.user()?.role ?? '',
        },
      })
    : req;

  return next(authReq);
};
