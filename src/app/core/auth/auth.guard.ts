import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanMatchFn = (route, segments) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const attemptedUrl = '/' + segments.map((s) => s.path).join('/');
  if (!authService.isInitialized()) {
    return router.createUrlTree(['/loading']);
  }

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/login'], {
      queryParams: { redirect: attemptedUrl },
    });
  }

  return true;
};
