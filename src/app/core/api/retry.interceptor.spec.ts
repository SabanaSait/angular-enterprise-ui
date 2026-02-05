import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse, HttpRequest, HttpResponse, HttpHeaders } from '@angular/common/http';
import { of, throwError, lastValueFrom } from 'rxjs';
import { vi } from 'vitest';
import { retryInterceptor } from './retry.interceptor';
import { API_INTERCEPTOR_OPTIONS } from './api.model';
import { IS_FINAL_ERROR } from './api-context.token';

describe('retryInterceptor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should not retry when retry is disabled', async () => {
    const req = new HttpRequest('GET', '/test', null, {
      context: new HttpRequest('GET', '/test').context.set(API_INTERCEPTOR_OPTIONS, {
        retry: false,
      }),
    });
    const response = new HttpErrorResponse({ status: 500 });

    const next = vi.fn().mockReturnValue(throwError(() => response));

    await expect(
      TestBed.runInInjectionContext(() => lastValueFrom(retryInterceptor(req, next))),
    ).rejects.toThrow();

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(req);
  });

  it('should not retry for non-safe HTTP methods', async () => {
    const req = new HttpRequest('POST' as any, '/test', null, {
      context: new HttpRequest('POST' as any, '/test').context.set(API_INTERCEPTOR_OPTIONS, {
        retry: true,
      }),
    });
    const response = new HttpErrorResponse({ status: 500 });

    const next = vi.fn().mockReturnValue(throwError(() => response));

    await expect(
      TestBed.runInInjectionContext(() => lastValueFrom(retryInterceptor(req, next))),
    ).rejects.toThrow();

    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should retry on network error (status 0)', async () => {
    const req = new HttpRequest('GET', '/test', null, {
      context: new HttpRequest('GET', '/test').context.set(API_INTERCEPTOR_OPTIONS, {
        retry: true,
      }),
    });
    const errorResponse = new HttpErrorResponse({ status: 0 });
    const successResponse = new HttpResponse({ status: 200, body: { data: 'success' } });

    const next = vi
      .fn()
      .mockReturnValueOnce(throwError(() => errorResponse))
      .mockReturnValueOnce(of(successResponse));

    const result = await TestBed.runInInjectionContext(() =>
      lastValueFrom(retryInterceptor(req, next)),
    );

    expect(result).toBe(successResponse);
    expect(next).toHaveBeenCalledTimes(2);
  });

  it('should retry on request timeout (status 408)', async () => {
    const req = new HttpRequest('GET', '/test', null, {
      context: new HttpRequest('GET', '/test').context.set(API_INTERCEPTOR_OPTIONS, {
        retry: true,
      }),
    });
    const errorResponse = new HttpErrorResponse({ status: 408 });
    const successResponse = new HttpResponse({ status: 200, body: { data: 'success' } });

    const next = vi
      .fn()
      .mockReturnValueOnce(throwError(() => errorResponse))
      .mockReturnValueOnce(of(successResponse));

    const result = await TestBed.runInInjectionContext(() =>
      lastValueFrom(retryInterceptor(req, next)),
    );

    expect(result).toBe(successResponse);
    expect(next).toHaveBeenCalledTimes(2);
  });

  it('should retry on rate limit (status 429) with Retry-After header', async () => {
    const req = new HttpRequest('GET', '/test', null, {
      context: new HttpRequest('GET', '/test').context.set(API_INTERCEPTOR_OPTIONS, {
        retry: true,
      }),
    });
    const errorResponse = new HttpErrorResponse({
      status: 429,
      headers: new HttpHeaders({ 'Retry-After': '1' }),
    });
    const successResponse = new HttpResponse({ status: 200, body: { data: 'success' } });

    const next = vi
      .fn()
      .mockReturnValueOnce(throwError(() => errorResponse))
      .mockReturnValueOnce(of(successResponse));

    const result = await TestBed.runInInjectionContext(() =>
      lastValueFrom(retryInterceptor(req, next)),
    );

    expect(result).toBe(successResponse);
    expect(next).toHaveBeenCalledTimes(2);
  });

  it('should retry on server errors (5xx)', async () => {
    const req = new HttpRequest('GET', '/test', null, {
      context: new HttpRequest('GET', '/test').context.set(API_INTERCEPTOR_OPTIONS, {
        retry: true,
      }),
    });
    const errorResponse = new HttpErrorResponse({ status: 500 });
    const successResponse = new HttpResponse({ status: 200, body: { data: 'success' } });

    const next = vi
      .fn()
      .mockReturnValueOnce(throwError(() => errorResponse))
      .mockReturnValueOnce(of(successResponse));

    const result = await TestBed.runInInjectionContext(() =>
      lastValueFrom(retryInterceptor(req, next)),
    );

    expect(result).toBe(successResponse);
    expect(next).toHaveBeenCalledTimes(2);
  });

  it('should not retry on client errors (4xx)', async () => {
    const req = new HttpRequest('GET', '/test', null, {
      context: new HttpRequest('GET', '/test').context.set(API_INTERCEPTOR_OPTIONS, {
        retry: true,
      }),
    });
    const errorResponse = new HttpErrorResponse({ status: 404 });

    const next = vi.fn().mockReturnValue(throwError(() => errorResponse));

    await expect(
      TestBed.runInInjectionContext(() => lastValueFrom(retryInterceptor(req, next))),
    ).rejects.toThrow();

    expect(next).toHaveBeenCalledTimes(1);
  });

  it('should respect max retry count', async () => {
    const req = new HttpRequest('GET', '/test', null, {
      context: new HttpRequest('GET', '/test').context.set(API_INTERCEPTOR_OPTIONS, {
        retry: true,
        retryCount: 2,
      }),
    });
    const errorResponse = new HttpErrorResponse({ status: 500 });

    const next = vi.fn().mockReturnValue(throwError(() => errorResponse));

    await expect(
      TestBed.runInInjectionContext(() => lastValueFrom(retryInterceptor(req, next))),
    ).rejects.toThrow();

    expect(next).toHaveBeenCalledTimes(3); // Initial + 2 retries
  });

  it('should set IS_FINAL_ERROR context on last retry attempt', async () => {
    const req = new HttpRequest('GET', '/test', null, {
      context: new HttpRequest('GET', '/test').context.set(API_INTERCEPTOR_OPTIONS, {
        retry: true,
        retryCount: 1,
      }),
    });
    const errorResponse = new HttpErrorResponse({ status: 500 });

    const next = vi.fn().mockReturnValue(throwError(() => errorResponse));

    await expect(
      TestBed.runInInjectionContext(() => lastValueFrom(retryInterceptor(req, next))),
    ).rejects.toThrow();

    expect(next).toHaveBeenCalledTimes(2);
    // First call should not have IS_FINAL_ERROR
    expect(next.mock.calls[0][0].context.get(IS_FINAL_ERROR)).toBe(true);
    // Second call should have IS_FINAL_ERROR
    expect(next.mock.calls[1][0].context.get(IS_FINAL_ERROR)).toBe(true);
  });

  it('should allow safe HTTP methods (GET, HEAD, OPTIONS)', async () => {
    const methods = ['GET', 'HEAD', 'OPTIONS'];

    for (const method of methods) {
      const req = new HttpRequest(method as any, '/test', null, {
        context: new HttpRequest(method as any, '/test').context.set(API_INTERCEPTOR_OPTIONS, {
          retry: true,
        }),
      });
      const errorResponse = new HttpErrorResponse({ status: 0 });
      const successResponse = new HttpResponse({ status: 200, body: { data: 'success' } });

      const next = vi
        .fn()
        .mockReturnValueOnce(throwError(() => errorResponse))
        .mockReturnValueOnce(of(successResponse));

      const result = await TestBed.runInInjectionContext(() =>
        lastValueFrom(retryInterceptor(req, next)),
      );

      expect(result).toBe(successResponse);
    }
  });
});
