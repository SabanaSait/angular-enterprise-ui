import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { vi } from 'vitest';
import { UrlSegment } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from './auth.service';

describe('authGuard', () => {
  let authService: any;
  let router: any;

  beforeEach(() => {
    authService = {
      isInitialized: vi.fn(),
      isAuthenticated: vi.fn(),
    };

    router = {
      createUrlTree: vi.fn(),
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

    it('should redirect to loading page', () => {
      const route = {};
      const segments = [{ path: 'dashboard' }];
      const expectedUrlTree = { path: '/loading' };

      router.createUrlTree.mockReturnValue(expectedUrlTree);

      const result = TestBed.runInInjectionContext(() => authGuard(route as any, segments as any));

      expect(authService.isInitialized).toHaveBeenCalled();
      expect(router.createUrlTree).toHaveBeenCalledWith(['/loading']);
      expect(result).toBe(expectedUrlTree);
    });

    it('should not check authentication when not initialized', () => {
      const route = {};
      const segments = [{ path: 'dashboard' }];

      router.createUrlTree.mockReturnValue({ path: '/loading' });

      TestBed.runInInjectionContext(() => authGuard(route as any, segments as any));

      expect(authService.isAuthenticated).not.toHaveBeenCalled();
    });
  });

  describe('when auth service is initialized but user is not authenticated', () => {
    beforeEach(() => {
      authService.isInitialized.mockReturnValue(true);
      authService.isAuthenticated.mockReturnValue(false);
    });

    it('should redirect to login page with redirect query param', () => {
      const route = {};
      const segments = [{ path: 'dashboard' }, { path: 'users' }];
      const expectedUrlTree = { path: '/login', queryParams: { redirect: '/dashboard/users' } };

      router.createUrlTree.mockReturnValue(expectedUrlTree);

      const result = TestBed.runInInjectionContext(() => authGuard(route as any, segments as any));

      expect(authService.isInitialized).toHaveBeenCalled();
      expect(authService.isAuthenticated).toHaveBeenCalled();
      expect(router.createUrlTree).toHaveBeenCalledWith(['/login'], {
        queryParams: { redirect: '/dashboard/users' },
      });
      expect(result).toBe(expectedUrlTree);
    });

    it('should handle root path correctly', () => {
      const route = {};
      const segments: UrlSegment[] = [];
      const expectedUrlTree = { path: '/login', queryParams: { redirect: '/' } };

      router.createUrlTree.mockReturnValue(expectedUrlTree);

      const result = TestBed.runInInjectionContext(() => authGuard(route as any, segments));

      expect(router.createUrlTree).toHaveBeenCalledWith(['/login'], {
        queryParams: { redirect: '/' },
      });
      expect(result).toBe(expectedUrlTree);
    });

    it('should handle single segment path', () => {
      const route = {};
      const segments = [{ path: 'admin' }];
      const expectedUrlTree = { path: '/login', queryParams: { redirect: '/admin' } };

      router.createUrlTree.mockReturnValue(expectedUrlTree);

      const result = TestBed.runInInjectionContext(() => authGuard(route as any, segments as any));

      expect(router.createUrlTree).toHaveBeenCalledWith(['/login'], {
        queryParams: { redirect: '/admin' },
      });
      expect(result).toBe(expectedUrlTree);
    });
  });

  describe('when user is authenticated', () => {
    beforeEach(() => {
      authService.isInitialized.mockReturnValue(true);
      authService.isAuthenticated.mockReturnValue(true);
    });

    it('should allow access', () => {
      const route = {};
      const segments = [{ path: 'dashboard' }];

      const result = TestBed.runInInjectionContext(() => authGuard(route as any, segments as any));

      expect(authService.isInitialized).toHaveBeenCalled();
      expect(authService.isAuthenticated).toHaveBeenCalled();
      expect(router.createUrlTree).not.toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should allow access regardless of path', () => {
      const testCases = [
        [{ path: 'dashboard' }],
        [{ path: 'admin' }, { path: 'users' }],
        [{ path: 'unauthorized' }],
        [],
      ];

      testCases.forEach((segments) => {
        const result = TestBed.runInInjectionContext(() => authGuard({} as any, segments as any));

        expect(result).toBe(true);
      });
    });
  });
});
