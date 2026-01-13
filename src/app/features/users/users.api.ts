import { Injectable } from '@angular/core';
import { ApiService } from '../../core/api/api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersApi {
  constructor(private api: ApiService) {}

  public getUsers() {
    return this.api.get('/api/users', {
      interceptorOptions: {
        retry: true,
        retryCount: 3,
      },
    });
  }
}
