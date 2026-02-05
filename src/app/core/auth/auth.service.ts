import { Injectable, signal, computed } from '@angular/core';
import { Role, Permission } from './auth.types';
import { ROLE_PERMISSIONS } from './auth.constants';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private static readonly STORAGE_KEY = 'auth_user';
  private readonly _user = signal<{ role: Role; permissions: Permission[] } | null>(null);
  private readonly _initialized = signal(false);

  public readonly isAuthenticated = computed(() => this._user() !== null);
  public readonly isInitialized = computed(() => this._initialized());
  public readonly user = this._user.asReadonly();

  public hasPermission(permission: Permission): boolean {
    return this._user()?.permissions.includes(permission) ?? false;
  }

  public hasAccess = (permission?: Permission) => !permission || this.hasPermission(permission);

  public login(role: Role = 'USER') {
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

    if (rawStorageKey) {
      try {
        const persisted = JSON.parse(rawStorageKey) as { role: Role };
        // Validate that the role exists in ROLE_PERMISSIONS
        if (persisted.role && ROLE_PERMISSIONS[persisted.role]) {
          const userRole = persisted.role;
          this._user.set({
            role: userRole,
            permissions: ROLE_PERMISSIONS[userRole],
          });
        } else {
          // Invalid role, remove corrupted data
          localStorage.removeItem(AuthService.STORAGE_KEY);
        }
      } catch {
        localStorage.removeItem(AuthService.STORAGE_KEY);
      }
    }

    this._initialized.set(true);
  }

  private persistSession(user: { role: Role }): void {
    localStorage.setItem(AuthService.STORAGE_KEY, JSON.stringify(user));
  }
}
