import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Permission } from './auth.types';

export const permissionGuard = (required: Permission): CanMatchFn => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (auth.hasPermission(required)) {
      return true;
    }

    return router.createUrlTree(['/']);
  };
};
