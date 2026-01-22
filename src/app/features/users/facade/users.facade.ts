import { Injectable, signal, computed } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { UsersApi } from '../services/users.api';
import { toDataStateSignal } from '../../../core/data-state/data-state.signal';
import { UsersQuery } from '../models/users-query.model';
import { User } from '../models/user.model';
import { PaginatedResponse } from '../../../core/api/api.model';

@Injectable({ providedIn: 'root' })
export class UsersFacade {
  private readonly _query = signal<UsersQuery>({
    pageNumber: 1,
    pageSize: 20,
    sortBy: 'name',
    sortDirection: 'asc',
  });

  public readonly query = this._query.asReadonly();

  private readonly users$ = toObservable(this._query).pipe(
    switchMap((q) =>
      this.usersApi.getUsers({
        pageNumber: q.pageNumber,
        pageSize: q.pageSize,
        sortBy: q.sortBy,
        sortDirection: q.sortDirection,
      }),
    ),
  );

  readonly usersState = toDataStateSignal<PaginatedResponse<User>>(this.users$, {
    emitLoadingOnNext: true,
  });

  readonly loading = computed(() => this.usersState().status === 'loading');

  constructor(private readonly usersApi: UsersApi) {}

  /* ===== Intent APIs ===== */

  public setPage(pageNumber: number) {
    this._query.update((q) => ({ ...q, pageNumber }));
  }

  public setSort(sortBy: UsersQuery['sortBy'], sortDirection: UsersQuery['sortDirection']) {
    this._query.update((q) => ({
      ...q,
      pageNumber: 1,
      sortBy,
      sortDirection,
    }));
  }
}
