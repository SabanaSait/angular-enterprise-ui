import { Component, inject, signal } from '@angular/core';
import { UsersApi } from './users.api';
import { toDataStateSignal } from '../../core/data-state/data-state.signal';
import { EmptyStateComponent } from '../../shared/empty-state/empty-state.component';
import { User } from './user.types';
import { PaginatedResponse } from '../../core/api/api.types';

@Component({
  selector: 'app-users',
  imports: [EmptyStateComponent],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent {
  private readonly usersApi = inject(UsersApi);
  public pageNumber = signal(1);
  public pageSize = 10;
  public readonly userState = toDataStateSignal<PaginatedResponse<User>>(
    this.usersApi.getUsers(this.pageNumber(), this.pageSize)
  );

  public createUser() {
    // Navigate to user create form
  }
  public prevPage(): void {
    // go to previous page
  }
  public nextPage(): void {
    // go to next page
  }
}
