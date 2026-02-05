import { TestBed } from '@angular/core/testing';
import { vi, type Mock } from 'vitest';
import { AuthService } from './auth.service';
import { ROLE_PERMISSIONS } from './auth.constants';

describe('AuthService', () => {
  let service: AuthService;
  let localStorageMock: {
    getItem: Mock;
    setItem: Mock;
    removeItem: Mock;
    clear: Mock;
  };

  beforeEach(() => {
    // Mock localStorage
    localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    TestBed.configureTestingModule({
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should not be authenticated initially', () => {
      expect(service.isAuthenticated()).toBe(false);
    });

    it('should not be initialized initially', () => {
      expect(service.isInitialized()).toBe(false);
    });

    it('should have null user initially', () => {
      expect(service.user()).toBe(null);
    });
  });

  describe('login', () => {
    it('should login with USER role by default', () => {
      service.login();

      expect(service.isAuthenticated()).toBe(true);
      expect(service.user()).toEqual({
        role: 'USER',
        permissions: ROLE_PERMISSIONS.USER,
      });
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'auth_user',
        JSON.stringify({ role: 'USER' }),
      );
    });

    it('should login with specified role', () => {
      service.login('SUPERVISOR');

      expect(service.isAuthenticated()).toBe(true);
      expect(service.user()).toEqual({
        role: 'SUPERVISOR',
        permissions: ROLE_PERMISSIONS.SUPERVISOR,
      });
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'auth_user',
        JSON.stringify({ role: 'SUPERVISOR' }),
      );
    });

    it('should login with ADMIN role', () => {
      service.login('ADMIN');

      expect(service.isAuthenticated()).toBe(true);
      expect(service.user()).toEqual({
        role: 'ADMIN',
        permissions: ROLE_PERMISSIONS.ADMIN,
      });
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'auth_user',
        JSON.stringify({ role: 'ADMIN' }),
      );
    });
  });

  describe('logout', () => {
    beforeEach(() => {
      service.login('ADMIN');
    });

    it('should clear user and authentication state', () => {
      service.logout();

      expect(service.isAuthenticated()).toBe(false);
      expect(service.user()).toBe(null);
    });

    it('should remove user from localStorage', () => {
      service.logout();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_user');
    });
  });

  describe('hasPermission', () => {
    it('should return false when not authenticated', () => {
      expect(service.hasPermission('VIEW_DASHBOARD')).toBe(false);
    });

    it('should return true for permissions user has', () => {
      service.login('SUPERVISOR');

      expect(service.hasPermission('VIEW_DASHBOARD')).toBe(true);
      expect(service.hasPermission('VIEW_USERS')).toBe(true);
    });

    it('should return false for permissions user does not have', () => {
      service.login('SUPERVISOR');

      expect(service.hasPermission('MANAGE_USERS')).toBe(false);
      expect(service.hasPermission('VIEW_ADMIN')).toBe(false);
    });
  });

  describe('hasAccess', () => {
    it('should return true when no permission required', () => {
      expect(service.hasAccess()).toBe(true);
      expect(service.hasAccess(undefined)).toBe(true);
    });

    it('should return true when user has required permission', () => {
      service.login('SUPERVISOR');

      expect(service.hasAccess('VIEW_DASHBOARD')).toBe(true);
      expect(service.hasAccess('VIEW_USERS')).toBe(true);
    });

    it('should return false when user lacks required permission', () => {
      service.login('SUPERVISOR');

      expect(service.hasAccess('MANAGE_USERS')).toBe(false);
    });

    it('should return false when not authenticated and permission required', () => {
      expect(service.hasAccess('VIEW_DASHBOARD')).toBe(false);
    });
  });

  describe('restoreSession', () => {
    it('should restore session from valid localStorage data', () => {
      const storedUser = { role: 'SUPERVISOR' };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(storedUser));

      service.restoreSession();

      expect(service.isAuthenticated()).toBe(true);
      expect(service.isInitialized()).toBe(true);
      expect(service.user()).toEqual({
        role: 'SUPERVISOR',
        permissions: ROLE_PERMISSIONS.SUPERVISOR,
      });
    });

    it('should handle missing localStorage data', () => {
      localStorageMock.getItem.mockReturnValue(null);

      service.restoreSession();

      expect(service.isAuthenticated()).toBe(false);
      expect(service.isInitialized()).toBe(true);
      expect(service.user()).toBe(null);
    });

    it('should handle invalid JSON in localStorage', () => {
      localStorageMock.getItem.mockReturnValue('invalid json');

      service.restoreSession();

      expect(service.isAuthenticated()).toBe(false);
      expect(service.isInitialized()).toBe(true);
      expect(service.user()).toBe(null);
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_user');
    });

    it('should handle invalid role in localStorage', () => {
      const storedUser = { role: 'INVALID_ROLE' as any };
      localStorageMock.getItem.mockReturnValue(JSON.stringify(storedUser));

      service.restoreSession();

      expect(service.isAuthenticated()).toBe(false);
      expect(service.isInitialized()).toBe(true);
      expect(service.user()).toBe(null);
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_user');
    });
  });

  describe('session persistence', () => {
    it('should persist session on login', () => {
      service.login('USER');

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'auth_user',
        JSON.stringify({ role: 'USER' }),
      );
    });

    it('should clear session on logout', () => {
      service.login('ADMIN');
      service.logout();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_user');
    });
  });

  describe('computed signals', () => {
    it('should update isAuthenticated when user changes', () => {
      expect(service.isAuthenticated()).toBe(false);

      service.login('ADMIN');
      expect(service.isAuthenticated()).toBe(true);

      service.logout();
      expect(service.isAuthenticated()).toBe(false);
    });

    it('should update isInitialized after restoreSession', () => {
      expect(service.isInitialized()).toBe(false);

      service.restoreSession();
      expect(service.isInitialized()).toBe(true);
    });

    it('should provide readonly user signal', () => {
      expect(service.user()).toBe(null);

      service.login('SUPERVISOR');
      expect(service.user()).toEqual({
        role: 'SUPERVISOR',
        permissions: ROLE_PERMISSIONS.SUPERVISOR,
      });
    });
  });
});
