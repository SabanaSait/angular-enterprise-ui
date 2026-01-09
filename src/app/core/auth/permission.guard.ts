import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Permission } from './auth.types';

export const permissionGuard = (permission: Permission): CanMatchFn => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (!auth.isInitialized()) {
      return false;
    }

    if (!auth.isAuthenticated()) {
      router.navigateByUrl('/login');
      return false;
    }

    if (!auth.hasPermission(permission)) {
      router.navigateByUrl('/unauthorized');
      return false;
    }

    return true;
  };
};
