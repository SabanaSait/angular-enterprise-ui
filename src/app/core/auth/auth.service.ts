import { Injectable, signal, computed } from '@angular/core';
import { Role, Permission, ROLE_PERMISSIONS } from './auth.types';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _user = signal<{ role: Role; permissions: Permission[] } | null>(null);

  isAuthenticated = computed(() => this._user() !== null);

  hasPermission(permission: Permission): boolean {
    return this._user()?.permissions.includes(permission) ?? false;
  }

  hasAccess = (permission?: Permission) => !permission || this.hasPermission(permission);

  login(role: Role = 'ADMIN') {
    this._user.set({
      role,
      permissions: ROLE_PERMISSIONS[role],
    });
  }
  logout() {
    this._user.set(null);
  }
}
