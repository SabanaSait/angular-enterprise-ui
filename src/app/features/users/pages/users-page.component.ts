import { Component, inject, signal, computed } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { UsersApi } from '../services/users.api';
import { toDataStateSignal } from '../../../core/data-state/data-state.signal';
import { User } from '../models/user.model';
import { PaginatedResponse } from '../../../core/api/api.types';
import { UsersTableComponent } from '../components/users-table/users-table.component';

@Component({
  selector: 'app-users',
  imports: [UsersTableComponent],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.scss',
})
export class UsersPageComponent {
  private readonly usersApi = inject(UsersApi);
  public readonly pageQuery = signal({
    pageNumber: 1,
    pageSize: 10,
  });

  private readonly $users = toObservable(this.pageQuery).pipe(
    switchMap((q) => this.usersApi.getUsers(q.pageNumber, q.pageSize))
  );
  public readonly userState = toDataStateSignal<PaginatedResponse<User>>(this.$users);

  public readonly loading = computed(() => this.userState().status === 'loading');

  public setPageNumber(pageNumber: number) {
    this.pageQuery.update((q) => ({ ...q, pageNumber }));
    console.log(this.pageQuery());
  }
}
