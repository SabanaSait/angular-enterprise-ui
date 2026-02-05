import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { vi } from 'vitest';
import { HttpErrorResponse, HttpRequest, HttpResponse } from '@angular/common/http';
import { of, throwError, lastValueFrom } from 'rxjs';
import { apiInterceptor } from './api.interceptor';
import { AuthService } from '../auth/auth.service';
import { ErrorService } from '../error/error.service';
import { IS_FINAL_ERROR } from './api-context.token';

describe('apiInterceptor', () => {
  let authService: any;
  let router: any;
  let errorService: any;

  beforeEach(() => {
    authService = {
      logout: vi.fn(),
    };

    router = {
      navigateByUrl: vi.fn(),
    };

    errorService = {
      pushError: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
        { provide: ErrorService, useValue: errorService },
      ],
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('successful requests', () => {
    it('should pass through successful responses unchanged', async () => {
      const req = new HttpRequest('GET', '/api/test');
      const response = new HttpResponse({ status: 200, body: { data: 'test' } });

      const next = vi.fn().mockReturnValue(of(response));

      const result = await TestBed.runInInjectionContext(() =>
        lastValueFrom(apiInterceptor(req, next)),
      );

      expect(result).toBe(response);
      expect(next).toHaveBeenCalledWith(req);
    });
  });

  describe('401 Unauthorized errors', () => {
    it('should logout and redirect to login on 401 errors', async () => {
      const req = new HttpRequest('GET', '/api/protected').clone({
        context: new HttpRequest('GET', '/api/protected').context.set(IS_FINAL_ERROR, true),
      });
      const error = new HttpErrorResponse({
        status: 401,
        statusText: 'Unauthorized',
        url: '/api/protected',
      });

      const next = vi.fn().mockReturnValue(throwError(() => error));

      try {
        await TestBed.runInInjectionContext(() => lastValueFrom(apiInterceptor(req, next)));
        throw new Error('Should have thrown');
      } catch (err: any) {
        expect(authService.logout).toHaveBeenCalled();
        expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
        expect(errorService.pushError).toHaveBeenCalledWith({
          message: 'Http failure response for /api/protected: 401 Unauthorized',
          status: 401,
        });
        expect(err.status).toBe(401);
      }
    });

    it('should not logout on 401 if not final error (retry scenario)', async () => {
      const req = new HttpRequest('GET', '/api/protected').clone({
        context: new HttpRequest('GET', '/api/protected').context.set(IS_FINAL_ERROR, false),
      });
      const error = new HttpErrorResponse({
        status: 401,
        statusText: 'Unauthorized',
        url: '/api/protected',
      });

      const next = vi.fn().mockReturnValue(throwError(() => error));

      try {
        await TestBed.runInInjectionContext(() => lastValueFrom(apiInterceptor(req, next)));
        throw new Error('Should have thrown');
      } catch (err: any) {
        expect(authService.logout).not.toHaveBeenCalled();
        expect(router.navigateByUrl).not.toHaveBeenCalled();
        expect(errorService.pushError).not.toHaveBeenCalled();
        expect(err.status).toBe(401);
      }
    });
  });

  describe('403 Forbidden errors', () => {
    it('should redirect to unauthorized page on 403 errors', async () => {
      const req = new HttpRequest('GET', '/api/admin').clone({
        context: new HttpRequest('GET', '/api/admin').context.set(IS_FINAL_ERROR, true),
      });
      const error = new HttpErrorResponse({
        status: 403,
        statusText: 'Forbidden',
        url: '/api/admin',
      });

      const next = vi.fn().mockReturnValue(throwError(() => error));

      try {
        await TestBed.runInInjectionContext(() => lastValueFrom(apiInterceptor(req, next)));
        throw new Error('Should have thrown');
      } catch (err: any) {
        expect(router.navigateByUrl).toHaveBeenCalledWith('/unauthorized');
        expect(authService.logout).not.toHaveBeenCalled();
        expect(errorService.pushError).toHaveBeenCalledWith({
          message: 'Http failure response for /api/admin: 403 Forbidden',
          status: 403,
        });
        expect(err.status).toBe(403);
      }
    });

    it('should not redirect on 403 if not final error', async () => {
      const req = new HttpRequest('GET', '/api/admin').clone({
        context: new HttpRequest('GET', '/api/admin').context.set(IS_FINAL_ERROR, false),
      });
      const error = new HttpErrorResponse({
        status: 403,
        statusText: 'Forbidden',
        url: '/api/admin',
      });

      const next = vi.fn().mockReturnValue(throwError(() => error));

      try {
        await TestBed.runInInjectionContext(() => lastValueFrom(apiInterceptor(req, next)));
        throw new Error('Should have thrown');
      } catch (err: any) {
        expect(router.navigateByUrl).not.toHaveBeenCalled();
        expect(errorService.pushError).not.toHaveBeenCalled();
        expect(err.status).toBe(403);
      }
    });
  });

  describe('other HTTP errors', () => {
    it('should handle 404 errors and add to error service', async () => {
      const req = new HttpRequest('GET', '/api/not-found').clone({
        context: new HttpRequest('GET', '/api/not-found').context.set(IS_FINAL_ERROR, true),
      });
      const error = new HttpErrorResponse({
        status: 404,
        statusText: 'Not Found',
        url: '/api/not-found',
      });

      const next = vi.fn().mockReturnValue(throwError(() => error));

      try {
        await TestBed.runInInjectionContext(() => lastValueFrom(apiInterceptor(req, next)));
        throw new Error('Should have thrown');
      } catch (err: any) {
        expect(errorService.pushError).toHaveBeenCalledWith({
          message: 'Http failure response for /api/not-found: 404 Not Found',
          status: 404,
        });
        expect(authService.logout).not.toHaveBeenCalled();
        expect(router.navigateByUrl).not.toHaveBeenCalled();
        expect(err.status).toBe(404);
      }
    });

    it('should handle 500 server errors', async () => {
      const req = new HttpRequest('POST', '/api/data', {}).clone({
        context: new HttpRequest('POST', '/api/data', {}).context.set(IS_FINAL_ERROR, true),
      });
      const error = new HttpErrorResponse({
        status: 500,
        statusText: 'Internal Server Error',
        url: '/api/data',
      });

      const next = vi.fn().mockReturnValue(throwError(() => error));

      try {
        await TestBed.runInInjectionContext(() => lastValueFrom(apiInterceptor(req, next)));
        throw new Error('Should have thrown');
      } catch (err: any) {
        expect(errorService.pushError).toHaveBeenCalledWith({
          message: 'Http failure response for /api/data: 500 Internal Server Error',
          status: 500,
        });
        expect(authService.logout).not.toHaveBeenCalled();
        expect(router.navigateByUrl).not.toHaveBeenCalled();
        expect(err.status).toBe(500);
      }
    });

    it('should handle network errors (no status)', async () => {
      const req = new HttpRequest('GET', '/api/test').clone({
        context: new HttpRequest('GET', '/api/test').context.set(IS_FINAL_ERROR, true),
      });
      const error = new HttpErrorResponse({
        error: 'Network Error',
        status: 0,
        statusText: 'Unknown Error',
      });

      const next = vi.fn().mockReturnValue(throwError(() => error));

      try {
        await TestBed.runInInjectionContext(() => lastValueFrom(apiInterceptor(req, next)));
        throw new Error('Should have thrown');
      } catch (err: any) {
        expect(errorService.pushError).toHaveBeenCalledWith({
          message: 'Http failure response for (unknown url): 0 Unknown Error',
          status: 0,
        });
        expect(authService.logout).not.toHaveBeenCalled();
        expect(router.navigateByUrl).not.toHaveBeenCalled();
        expect(err.status).toBe(0);
      }
    });

    it('should not add non-final errors to error service', async () => {
      const req = new HttpRequest('GET', '/api/test').clone({
        context: new HttpRequest('GET', '/api/test').context.set(IS_FINAL_ERROR, false),
      });
      const error = new HttpErrorResponse({
        status: 404,
        statusText: 'Not Found',
        url: '/api/test',
      });

      const next = vi.fn().mockReturnValue(throwError(() => error));

      try {
        await TestBed.runInInjectionContext(() => lastValueFrom(apiInterceptor(req, next)));
        throw new Error('Should have thrown');
      } catch (err: any) {
        expect(errorService.pushError).not.toHaveBeenCalled();
        expect(authService.logout).not.toHaveBeenCalled();
        expect(router.navigateByUrl).not.toHaveBeenCalled();
        expect(err.status).toBe(404);
      }
    });
  });

  describe('error normalization', () => {
    it('should use normalized error messages', async () => {
      const req = new HttpRequest('GET', '/api/test').clone({
        context: new HttpRequest('GET', '/api/test').context.set(IS_FINAL_ERROR, true),
      });
      const error = new HttpErrorResponse({
        status: 400,
        statusText: 'Bad Request',
        error: { message: 'Validation failed', details: ['Field is required'] },
        url: '/api/test',
      });

      const next = vi.fn().mockReturnValue(throwError(() => error));

      try {
        await TestBed.runInInjectionContext(() => lastValueFrom(apiInterceptor(req, next)));
        throw new Error('Should have thrown');
      } catch (err: any) {
        // The error normalizer should extract the message from the error object
        expect(errorService.pushError).toHaveBeenCalledWith({
          message: expect.any(String),
          status: 400,
        });
      }
    });
  });
});
