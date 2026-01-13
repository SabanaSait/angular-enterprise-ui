import { HttpContext, HttpContextToken, HttpHeaders, HttpParams } from '@angular/common/http';

export interface ApiHttpOptions {
  headers?: HttpHeaders;
  params?: HttpParams;
  context?: HttpContext;
  withCredentials?: boolean;

  /** Interceptor-level options */
  interceptorOptions?: ApiInterceptorOptions;
}

export interface ApiError {
  status: number;
  message: string;
  code?: string;
  details?: unknown;
  original?: unknown;
}

export interface ApiInterceptorOptions {
  retry?: boolean;
  retryCount?: number;
  retryDelay?: number;
}

export const API_INTERCEPTOR_OPTIONS = new HttpContextToken<ApiInterceptorOptions>(() => ({
  retry: true,
  retryCount: 2,
  retryDelay: 500,
}));
