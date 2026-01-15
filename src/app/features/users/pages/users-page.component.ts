import { Component, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { UsersApi } from '../services/users.api';
import { toDataStateSignal } from '../../../core/data-state/data-state.signal';
import { EmptyStateComponent } from '../../../shared/empty-state/empty-state.component';
import { User } from '../models/user.model';
import { PaginatedResponse } from '../../../core/api/api.types';

@Component({
  selector: 'app-users',
  imports: [EmptyStateComponent],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.scss',
})
export class UsersPageComponent {
  private readonly usersApi = inject(UsersApi);
  public pageNumber = signal(1);
  public pageSize = 10;

  private readonly $users = toObservable(this.pageNumber).pipe(
    switchMap((page) => this.usersApi.getUsers(page, this.pageSize))
  );
  public readonly userState = toDataStateSignal<PaginatedResponse<User>>(this.$users);

  public createUser() {
    // Navigate to user create form
  }
  public prevPage(): void {
    this.pageNumber.update((page) => Math.max(1, page - 1));
  }
  public nextPage(): void {
    this.pageNumber.update((page) => page + 1);
  }
}
