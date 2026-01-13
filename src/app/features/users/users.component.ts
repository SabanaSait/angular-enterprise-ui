import { Component } from '@angular/core';
import { UsersApi } from './users.api';

@Component({
  selector: 'app-users',
  imports: [],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent {
  constructor(private usersApi: UsersApi) {
    this.usersApi.getUsers().subscribe();
  }
}
