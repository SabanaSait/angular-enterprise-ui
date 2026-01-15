import { Injectable } from '@angular/core';
import { ApiService } from '../../../core/api/api.service';
import { NotificationService } from '../../../core/notification/notification.service';
import { Observable, tap } from 'rxjs';
import { User } from '../models/user.model';
import { PaginatedResponse } from '../../../core/api/api.types';
import { HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UsersApi {
  constructor(private api: ApiService, private notificationService: NotificationService) {}

  public getUsers(pageNumber = 1, pageSize = 10): Observable<PaginatedResponse<User>> {
    const params = new HttpParams().set('pageNumber', pageNumber).set('pageSize', pageSize);
    return this.api.get<PaginatedResponse<User>>('/api/users', {
      params,
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
