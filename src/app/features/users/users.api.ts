import { Injectable } from '@angular/core';
import { ApiService } from '../../core/api/api.service';
import { NotificationService } from '../../core/notification/notification.service';
import { Observable, tap } from 'rxjs';
import { User } from './user.types';

@Injectable({ providedIn: 'root' })
export class UsersApi {
  constructor(private api: ApiService, private notificationService: NotificationService) {}

  public getUsers(): Observable<User[]> {
    return this.api.get<User[]>('/api/users', {
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
