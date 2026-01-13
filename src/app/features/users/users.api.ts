import { Injectable } from '@angular/core';
import { ApiService } from '../../core/api/api.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersApi {
  constructor(private api: ApiService) {}

  public getUsers(): Observable<any> {
    return this.api.get('/users', {
      interceptorOptions: {
        retry: true,
        retryCount: 3,
      },
    });
  }
}
