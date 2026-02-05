import { Injectable, signal, computed, inject } from '@angular/core';
import { switchMap } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { UsersApi } from '../services/users.api';
import { toDataStateSignal } from '../../../core/data-state/data-state.signal';
import { UsersQuery } from '../models/users-query.model';
import { User } from '../models/user.model';
import { CreateUserDto, UpdateUserDto } from '../models/user.dto';
import { PaginatedResponse } from '../../../core/api/api.model';

@Injectable({ providedIn: 'root' })
export class UsersFacade {
  private readonly usersApi = inject(UsersApi);

  private readonly _query = signal<UsersQuery>({
    pageNumber: 1,
    pageSize: 20,
    sortBy: 'name',
    sortDirection: 'asc',
  });
  private readonly refreshTick = signal(0);

  public readonly query = this._query.asReadonly();

  private readonly users$ = toObservable(
    computed(() => ({
      query: this._query(),
      refresh: this.refreshTick(),
    })),
  ).pipe(
    switchMap(({ query }) =>
      this.usersApi.getUsers({
        pageNumber: query.pageNumber,
        pageSize: query.pageSize,
        sortBy: query.sortBy,
        sortDirection: query.sortDirection,
      }),
    ),
  );

  // Observable that emits when query changes (triggers loading)
  private readonly queryChange$ = toObservable(
    computed(() => ({
      query: this._query(),
      refresh: this.refreshTick(),
    })),
  );

  public readonly usersState = toDataStateSignal<PaginatedResponse<User>>(this.users$, {
    loadingTrigger$: this.queryChange$, // Emit loading when query changes
  });

  readonly loading = computed(() => this.usersState().status === 'loading');

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

  public getUser(id: string) {
    return this.usersApi.getUser(id);
  }

  public createUser(payload: CreateUserDto): void {
    this.usersApi.createUser(payload).subscribe(() => {
      this.refresh();
    });
  }

  public updateUser(payload: UpdateUserDto): void {
    this.usersApi.updateUser(payload).subscribe(() => {
      this.refresh();
    });
  }

  public deleteUser(id: string): void {
    this.usersApi.deleteUser(id).subscribe(() => {
      this.refresh();
    });
  }

  private refresh(): void {
    this.refreshTick.update((val) => val + 1);
  }
}
