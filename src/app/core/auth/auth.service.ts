import { Injectable, signal, computed } from '@angular/core';
import { Role, Permission, ROLE_PERMISSIONS } from './auth.types';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private static readonly STORAGE_KEY = 'auth_user';
  private readonly _user = signal<{ role: Role; permissions: Permission[] } | null>(null);

  public readonly isAuthenticated = computed(() => this._user() !== null);

  public hasPermission(permission: Permission): boolean {
    return this._user()?.permissions.includes(permission) ?? false;
  }

  public hasAccess = (permission?: Permission) => !permission || this.hasPermission(permission);

  public login(role: Role = 'ADMIN') {
    this._user.set({
      role,
      permissions: ROLE_PERMISSIONS[role],
    });
    this.persistSession({ role });
  }

  public logout() {
    this._user.set(null);
    localStorage.removeItem(AuthService.STORAGE_KEY);
  }

  /* ---- Restrore session during APP Bootstrap ----- */
  public restoreSession(): void {
    const rawStorageKey = localStorage.getItem(AuthService.STORAGE_KEY);
    if (!rawStorageKey) return;

    try {
      const persisted = JSON.parse(rawStorageKey) as { role: Role };
      this._user.set({
        role: persisted.role,
        permissions: ROLE_PERMISSIONS[persisted.role],
      });
    } catch {
      localStorage.removeItem(AuthService.STORAGE_KEY);
    }
  }

  private persistSession(user: { role: Role }): void {
    localStorage.setItem(AuthService.STORAGE_KEY, JSON.stringify(user));
  }
}
