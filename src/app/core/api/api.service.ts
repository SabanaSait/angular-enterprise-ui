import { Injectable } from '@angular/core';
import { ApiHttpOptions } from './api.types';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  public get<T>(url: string, options?: ApiHttpOptions) {
    return this.http.get(url, options);
  }

  public post<T>(url: string, body: unknown, options?: ApiHttpOptions) {
    return this.http.post(url, body, options);
  }

  public put<T>(url: string, body: unknown, options?: ApiHttpOptions) {
    return this.http.put(url, body, options);
  }

  public delete<T>(url: string, options?: ApiHttpOptions) {
    return this.http.delete(url, options);
  }
}
