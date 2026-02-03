import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/api/api.service';
import { AdminRole } from '../models/role.model';

@Injectable({
  providedIn: 'root',
})
export class RolesApi {
  private readonly baseUrl = '/api/admin/roles';

  constructor(private readonly api: ApiService) {}

  public getRoles(): Observable<AdminRole[]> {
    console.log('get roles called....');
    return this.api.get<AdminRole[]>(this.baseUrl, {
      interceptorOptions: {
        retry: true,
      },
    });
  }

  public getRole(id: string): Observable<AdminRole> {
    return this.api.get<AdminRole>(`${this.baseUrl}/${id}`, {
      interceptorOptions: {
        retry: true,
      },
    });
  }

  public createRole(payload: Partial<AdminRole>): Observable<AdminRole> {
    return this.api.post<AdminRole>(this.baseUrl, payload);
  }

  public updateRole(id: string, payload: Partial<AdminRole>): Observable<AdminRole> {
    return this.api.put<AdminRole>(`${this.baseUrl}/${id}`, payload);
  }

  public deleteRole(id: string): void {
    this.api.delete<void>(`${this.baseUrl}/${id}`);
  }
}
