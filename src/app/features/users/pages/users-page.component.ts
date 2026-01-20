import { Component, inject, signal, computed } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { UsersApi } from '../services/users.api';
import { toDataStateSignal } from '../../../core/data-state/data-state.signal';
import { User } from '../models/user.model';
import { SortDirection, UserSortKey, UsersQuery } from '../models/users-query.model';
import { PaginatedResponse } from '../../../core/api/api.model';
import { UsersTableComponent } from '../components/users-table/users-table.component';

@Component({
  selector: 'app-users',
  imports: [UsersTableComponent],
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.scss',
})
export class UsersPageComponent {
  private readonly usersApi = inject(UsersApi);
  public readonly query = signal<UsersQuery>({
    pageNumber: 1,
    pageSize: 20,
    sortBy: 'name',
    sortDirection: 'asc',
  });

  private readonly $users = toObservable(this.query).pipe(
    switchMap((q) =>
      this.usersApi.getUsers({
        pageNumber: q.pageNumber,
        pageSize: q.pageSize,
        sortBy: q.sortBy,
        sortDirection: q.sortDirection,
      }),
    ),
  );
  public readonly userState = toDataStateSignal<PaginatedResponse<User>>(this.$users, {
    emitLoadingOnNext: true,
  });

  public readonly loading = computed(() => this.userState().status === 'loading');

  // Sorting and pagination are query-driven.
  // This allows easy extraction into a facade later.

  public setPageNumber(pageNumber: number) {
    this.query.update((q) => ({ ...q, pageNumber }));
  }

  public setSort(sort: { by: UserSortKey; direction: SortDirection }) {
    this.query.update((q) => ({
      ...q,
      pageNumber: 1,
      sortBy: sort.by,
      sortDirection: sort.direction,
    }));
  }
}
