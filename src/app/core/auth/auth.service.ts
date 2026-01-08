import { Injectable, signal, computed } from '@angular/core';
import { Role, Permission, ROLE_PERMISSIONS } from './auth.types';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _user = signal<{ role: Role; permissions: Permission[] } | null>(null);

  isAuthenticated = computed(() => this._user() !== null);

  hasPermission(permission: Permission): boolean {
    const user = this._user();
    return user ? ROLE_PERMISSIONS[user.role].includes(permission) : false;
  }

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
