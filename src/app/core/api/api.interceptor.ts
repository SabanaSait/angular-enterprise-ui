import { HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { normalizeHttpError } from './error-normalizer';
import { AuthService } from '../auth/auth.service';
import { ErrorService } from '../error/error.service';
import { IS_FINAL_ERROR } from './api-context.token';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const auth = inject(AuthService);
  const errorService = inject(ErrorService);

  return next(req).pipe(
    catchError((error) => {
      const normalizedError = normalizeHttpError(error);
      const isFinalError = req.context.get(IS_FINAL_ERROR);

      // Ignore intermediate retry failures
      if (!isFinalError) {
        return throwError(() => normalizedError);
      }

      if (normalizedError.status === 401) {
        auth.logout();
        router.navigateByUrl('/login');
      }
      if (normalizedError.status === 403) {
        router.navigateByUrl('/unauthorized');
      }

      // raise doamin error
      errorService.pushError({
        message: normalizedError.message,
        status: normalizedError.status,
      });

      return throwError(() => normalizedError);
    }),
  );
};
