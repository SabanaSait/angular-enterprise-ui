import { Component, inject } from '@angular/core';
import { UsersApi } from './users.api';
import { toDataStateSignal } from '../../core/data-state/data-state.signal';

@Component({
  selector: 'app-users',
  imports: [],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent {
  private readonly usersApi = inject(UsersApi);
  public readonly userState = toDataStateSignal(this.usersApi.getUsers());
}
