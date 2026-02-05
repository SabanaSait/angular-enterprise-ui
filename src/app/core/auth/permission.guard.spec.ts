import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { vi } from 'vitest';
import { permissionGuard } from './permission.guard';
import { AuthService } from './auth.service';
import { Permission } from './auth.types';

describe('permissionGuard', () => {
  let authService: any;
  let router: any;

  beforeEach(() => {
    authService = {
      isInitialized: vi.fn(),
      isAuthenticated: vi.fn(),
      hasPermission: vi.fn(),
    };

    router = {
      navigateByUrl: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('when auth service is not initialized', () => {
    beforeEach(() => {
      authService.isInitialized.mockReturnValue(false);
    });

    it('should deny access', () => {
      const guard = permissionGuard('VIEW_DASHBOARD');

      const result = TestBed.runInInjectionContext(() => guard({} as any, [] as any));

      expect(authService.isInitialized).toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('should not check authentication or permissions when not initialized', () => {
      const guard = permissionGuard('VIEW_ADMIN');

      TestBed.runInInjectionContext(() => guard({} as any, [] as any));

      expect(authService.isAuthenticated).not.toHaveBeenCalled();
      expect(authService.hasPermission).not.toHaveBeenCalled();
      expect(router.navigateByUrl).not.toHaveBeenCalled();
    });
  });

  describe('when auth service is initialized but user is not authenticated', () => {
    beforeEach(() => {
      authService.isInitialized.mockReturnValue(true);
      authService.isAuthenticated.mockReturnValue(false);
    });

    it('should redirect to login and deny access', () => {
      const guard = permissionGuard('MANAGE_USERS');

      const result = TestBed.runInInjectionContext(() => guard({} as any, [] as any));

      expect(authService.isInitialized).toHaveBeenCalled();
      expect(authService.isAuthenticated).toHaveBeenCalled();
      expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
      expect(result).toBe(false);
    });

    it('should not check permissions when not authenticated', () => {
      const guard = permissionGuard('VIEW_ROLES');

      TestBed.runInInjectionContext(() => guard({} as any, [] as any));

      expect(authService.hasPermission).not.toHaveBeenCalled();
    });
  });

  describe('when user is authenticated but lacks permission', () => {
    beforeEach(() => {
      authService.isInitialized.mockReturnValue(true);
      authService.isAuthenticated.mockReturnValue(true);
      authService.hasPermission.mockReturnValue(false);
    });

    it('should redirect to unauthorized and deny access', () => {
      const guard = permissionGuard('MANAGE_PERMISSIONS');

      const result = TestBed.runInInjectionContext(() => guard({} as any, [] as any));

      expect(authService.isInitialized).toHaveBeenCalled();
      expect(authService.isAuthenticated).toHaveBeenCalled();
      expect(authService.hasPermission).toHaveBeenCalledWith('MANAGE_PERMISSIONS');
      expect(router.navigateByUrl).toHaveBeenCalledWith('/unauthorized');
      expect(result).toBe(false);
    });

    it('should check the correct permission', () => {
      const permissions: Permission[] = [
        'VIEW_DASHBOARD',
        'VIEW_USERS',
        'MANAGE_USERS',
        'VIEW_ADMIN',
        'VIEW_ROLES',
        'VIEW_PERMISSIONS',
        'MANAGE_ROLES',
        'MANAGE_PERMISSIONS',
      ];

      permissions.forEach((permission) => {
        const guard = permissionGuard(permission);

        TestBed.runInInjectionContext(() => guard({} as any, [] as any));

        expect(authService.hasPermission).toHaveBeenCalledWith(permission);
      });
    });
  });

  describe('when user is authenticated and has permission', () => {
    beforeEach(() => {
      authService.isInitialized.mockReturnValue(true);
      authService.isAuthenticated.mockReturnValue(true);
      authService.hasPermission.mockReturnValue(true);
    });

    it('should allow access', () => {
      const guard = permissionGuard('VIEW_DASHBOARD');

      const result = TestBed.runInInjectionContext(() => guard({} as any, [] as any));

      expect(authService.isInitialized).toHaveBeenCalled();
      expect(authService.isAuthenticated).toHaveBeenCalled();
      expect(authService.hasPermission).toHaveBeenCalledWith('VIEW_DASHBOARD');
      expect(router.navigateByUrl).not.toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should allow access for all permissions when user has them', () => {
      const permissions: Permission[] = [
        'VIEW_DASHBOARD',
        'VIEW_USERS',
        'MANAGE_USERS',
        'VIEW_ADMIN',
        'VIEW_ROLES',
        'VIEW_PERMISSIONS',
        'MANAGE_ROLES',
        'MANAGE_PERMISSIONS',
      ];

      permissions.forEach((permission) => {
        authService.hasPermission.mockReturnValue(true);
        const guard = permissionGuard(permission);

        const result = TestBed.runInInjectionContext(() => guard({} as any, [] as any));

        expect(result).toBe(true);
        expect(router.navigateByUrl).not.toHaveBeenCalled();
      });
    });
  });

  describe('guard creation', () => {
    it('should create different guards for different permissions', () => {
      const viewDashboardGuard = permissionGuard('VIEW_DASHBOARD');
      const manageUsersGuard = permissionGuard('MANAGE_USERS');

      expect(viewDashboardGuard).not.toBe(manageUsersGuard);
      expect(typeof viewDashboardGuard).toBe('function');
      expect(typeof manageUsersGuard).toBe('function');
    });

    it('should return a CanMatchFn', () => {
      const guard = permissionGuard('VIEW_ADMIN');

      expect(typeof guard).toBe('function');
      // The guard function should be a CanMatchFn (route, segments) => boolean | UrlTree
      // Since it's created by the permissionGuard factory, we just verify it's a function
      expect(guard).toBeDefined();
    });
  });
});
