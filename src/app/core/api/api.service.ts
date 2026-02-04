import { Injectable, inject } from '@angular/core';
import { API_INTERCEPTOR_OPTIONS, ApiHttpOptions } from './api.model';
import { HttpClient, HttpContext } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);


  public get<T>(url: string, options?: ApiHttpOptions): Observable<T> {
    return this.http.get<T>(url, this.buildHttpOptions(options));
  }

  public post<T>(url: string, body: unknown, options?: ApiHttpOptions): Observable<T> {
    return this.http.post<T>(url, body, this.buildHttpOptions(options));
  }

  public put<T>(url: string, body: unknown, options?: ApiHttpOptions): Observable<T> {
    return this.http.put<T>(url, body, this.buildHttpOptions(options));
  }

  public delete<T>(url: string, options?: ApiHttpOptions): Observable<T> {
    return this.http.delete<T>(url, this.buildHttpOptions(options));
  }

  private buildHttpOptions(options?: ApiHttpOptions) {
    return {
      headers: options?.headers,
      params: options?.params,
      withCredentials: options?.withCredentials,
      context: this.buildContext(options),
    };
  }

  private buildContext(options?: ApiHttpOptions): HttpContext {
    let context = new HttpContext();

    if (options?.interceptorOptions) {
      context = context.set(API_INTERCEPTOR_OPTIONS, options.interceptorOptions);
    }

    return context;
  }
}
