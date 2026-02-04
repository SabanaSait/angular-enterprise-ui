import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/api/api.service';
import { AdminPermission } from '../models/permission.model';

@Injectable({
  providedIn: 'root',
})
export class PermissionsApi {
  private readonly api = inject(ApiService);

  private readonly baseUrl = '/api/admin/permissions';

  public getPermissions(): Observable<AdminPermission[]> {
    return this.api.get<AdminPermission[]>(this.baseUrl, {
      interceptorOptions: {
        retry: true,
      },
    });
  }

  public getPermission(id: string): Observable<AdminPermission> {
    return this.api.get(`${this.baseUrl}/${id}`);
  }

  public createPermission(payload: Partial<AdminPermission>): Observable<AdminPermission> {
    return this.api.put(`${this.baseUrl}`, payload);
  }

  public updatePermission(
    id: string,
    payload: Partial<AdminPermission>,
  ): Observable<AdminPermission> {
    return this.api.put(`${this.baseUrl}/${id}`, payload);
  }

  public deletePermission(id: string) {
    return this.api.delete(`${this.baseUrl}/${id}`);
  }
}
