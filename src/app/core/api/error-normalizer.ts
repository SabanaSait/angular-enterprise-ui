import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from './api.model';

export function normalizeHttpError(error: unknown): ApiError {
  if (error instanceof HttpErrorResponse) {
    return {
      status: error.status,
      message:
        error.error?.message || error.error?.error || error.message || 'Unexpected server error',
      code: error.error?.code,
      details: error.error,
      original: error,
    };
  }

  return {
    status: 0,
    message: 'Unknown error occured',
    original: error,
  };
}
