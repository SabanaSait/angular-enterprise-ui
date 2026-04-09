import { Injectable, inject } from '@angular/core';
import { ApiService } from '../../../core/api/api.service';
import { NotificationService } from '../../../core/notification/notification.service';
import { Observable, tap } from 'rxjs';
import { User } from '../models/user.model';
import { PaginatedResponse } from '../../../core/api/api.model';
import { HttpParams } from '@angular/common/http';
import { SortDirection, UserSortKey } from '../models/users-query.model';
import { CreateUserDto, UpdateUserDto } from '../models/user.dto';

@Injectable({ providedIn: 'root' })
export class UsersApi {
  private api = inject(ApiService);
  private notificationService = inject(NotificationService);

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

  public getUser(id: string): Observable<User> {
    return this.api.get<User>(`/api/users/${id}`, {
      interceptorOptions: {
        retry: true,
        retryCount: 3,
      },
    });
  }

  public createUser(payload: CreateUserDto) {
    return this.api
      .post('/api/users', payload)
      .pipe(tap(() => this.notificationService.success('User created successfully!')));
  }

  public updateUser(id: string, payload: UpdateUserDto) {
    return this.api
      .put(`/api/users/${id}`, payload)
      .pipe(tap(() => this.notificationService.success('User updated successfully!')));
  }

  public deleteUser(id: string) {
    return this.api
      .delete(`/api/users/${id}`)
      .pipe(tap(() => this.notificationService.success('User deleted successfully!')));
  }
}
