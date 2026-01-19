import {
  HttpErrorResponse,
  HttpEvent,
  HttpRequest,
  HttpHandlerFn,
  HttpInterceptorFn,
} from '@angular/common/http';
import { timer, throwError, Observable } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { API_INTERCEPTOR_OPTIONS } from './api.model';

const DEFAULT_RETRY_COUNT = 2;
const BASE_DELAY_MS = 500;
const MAX_DELAY_MS = 4000;

export const retryInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const options = req.context.get(API_INTERCEPTOR_OPTIONS);

  // Retry must be explicitly enabled
  if (!options?.retry) {
    return next(req);
  }

  // Allow only safe HTTP methods
  if (!isRetryableMethod(req.method)) {
    return next(req);
  }

  const maxRetries = options.retryCount ?? DEFAULT_RETRY_COUNT;

  return next(req).pipe(catchError((error) => retryStrategy(error, req, next, maxRetries, 0)));
};

/* ----------------- Helpers ----------------- */

function isRetryableMethod(method: string): boolean {
  return ['GET', 'HEAD', 'OPTIONS'].includes(method);
}

function retryStrategy(
  error: HttpErrorResponse,
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  maxRetries: number,
  attempt: number
): Observable<HttpEvent<unknown>> {
  if (attempt >= maxRetries || !isRetryableError(error)) {
    return throwError(() => error);
  }

  const delay = calculateBackoff(attempt, error);

  return timer(delay).pipe(
    mergeMap(() =>
      next(req).pipe(catchError((err) => retryStrategy(err, req, next, maxRetries, attempt + 1)))
    )
  );
}

function isRetryableError(error: HttpErrorResponse): boolean {
  return (
    error.status === 0 || // Network error
    error.status === 408 || // Request timeout
    error.status === 429 || // Too many requests
    (error.status >= 500 && error.status < 600) // Server errors
  );
}

function calculateBackoff(attempt: number, error: HttpErrorResponse): number {
  // Honor Retry-After header for 429
  if (error.status === 429) {
    const retryAfter = Number(error.headers.get('Retry-After'));
    if (!isNaN(retryAfter)) {
      return retryAfter * 1000;
    }
  }

  const exponentialDelay = BASE_DELAY_MS * Math.pow(2, attempt);
  const jitter = Math.random() * 300;

  return Math.min(exponentialDelay + jitter, MAX_DELAY_MS);
}
