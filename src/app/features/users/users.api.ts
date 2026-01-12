import { Injectable } from '@angular/core';
import { ApiService } from '../../core/api/api.service';

@Injectable()
export class UsersApi {
  constructor(private api: ApiService) {}

  public getUsers() {
    this.api.get<User[]>('/users');
  }
}

export interface User {
  role: string[];
  permissions: string[];
}
