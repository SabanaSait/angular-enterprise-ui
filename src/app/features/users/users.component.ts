import { Component, inject } from '@angular/core';
import { UsersApi } from './users.api';
import { toDataStateSignal } from '../../core/data-state/data-state.signal';
import { EmptyStateComponent } from '../../shared/empty-state/empty-state.component';
import { User } from './user.types';

@Component({
  selector: 'app-users',
  imports: [EmptyStateComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent {
  private readonly usersApi = inject(UsersApi);
  public readonly userState = toDataStateSignal<User[]>(this.usersApi.getUsers());

  public createUser() {
    // Navigate to user create form
  }
}
