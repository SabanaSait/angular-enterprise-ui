import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/api/api.service';
import { NotificationService } from '../../../core/notification/notification.service';
import { Observable, tap } from 'rxjs';
import { User } from '../models/user.model';
import { PaginatedResponse } from '../../../core/api/api.model';
import { HttpParams } from '@angular/common/http';
import { SortDirection, UserSortKey } from '../models/users-query.model';

@Injectable({ providedIn: 'root' })
export class UsersApi {
  constructor(private api: ApiService, private notificationService: NotificationService) {}

  public getUsers(params: {
    pageNumber?: number;
    pageSize: number;
    sortBy?: UserSortKey;
    sortDirection?: SortDirection;
  }): Observable<PaginatedResponse<User>> {
    const httpParams = new HttpParams({
      fromObject: {
        pageNumber: params.pageNumber ?? 1,
        pageSize: params.pageSize ?? 10,
        ...(params.sortBy && { sortBy: params.sortBy }),
        ...(params.sortDirection && { sortDir: params.sortDirection }),
      },
    });

    return this.api.get<PaginatedResponse<User>>('/api/users', {
      params: httpParams,
      interceptorOptions: {
        retry: true,
        retryCount: 3,
      },
    });
  }

  public createUser(payload: any) {
    return this.api
      .post('/api/users', payload)
      .pipe(tap(() => this.notificationService.success('User created successfully!')));
  }

  public updateUser(payload: any) {
    return this.api
      .put('/api/users', payload)
      .pipe(tap(() => this.notificationService.success('User updated successfully!')));
  }

  public deleteUser(id: string) {
    return this.api
      .delete(`/api/users/${id}`)
      .pipe(tap(() => this.notificationService.success('User deleted successfully!')));
  }
}
