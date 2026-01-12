import { HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';

export interface ApiHttpOptions {
  header?: HttpHeaders;
  params?: HttpParams;
  context?: HttpContext;
  withCredentials?: boolean;
}

export interface ApiError {
  status: number;
  message: string;
  code?: string;
  details?: unknown;
  original?: unknown;
}
