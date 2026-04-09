import { Injectable, signal, computed, inject } from '@angular/core';
import { debounceTime, switchMap } from 'rxjs';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { UsersApi } from '../services/users.api';
import { toDataStateSignal } from '../../../core/data-state/data-state.signal';
import { UsersQuery } from '../models/users-query.model';
import { User } from '../models/user.model';
import { CreateUserDto, UpdateUserDto } from '../models/user.dto';
import { PaginatedResponse } from '../../../core/api/api.model';
import { SocketService } from '../../../core/services/socket.service';

@Injectable({ providedIn: 'root' })
export class UsersFacade {
  private readonly usersApi = inject(UsersApi);
  private readonly socketService = inject(SocketService);

  private readonly initialQuery: UsersQuery = {
    pageNumber: 1,
    pageSize: 20,
    sortBy: 'name',
    sortDirection: 'asc',
  };

  private readonly _query = signal<UsersQuery>(this.initialQuery);
  private readonly refreshTick = signal(0);

  // Ensure single socket connection to avoid duplicate event streams
  private readonly socketConnected = signal(false);

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

  public resetQuery(): void {
    this._query.set({ ...this.initialQuery });
  }

  public getUser(id: string) {
    return this.usersApi.getUser(id);
  }

  public createUser(payload: CreateUserDto): void {
    this.usersApi.createUser(payload).subscribe();
  }

  public updateUser(id: string, payload: UpdateUserDto): void {
    this.usersApi.updateUser(id, payload).subscribe();
  }

  public deleteUser(id: string): void {
    this.usersApi.deleteUser(id).subscribe();
  }

  public refresh(): void {
    this.refreshTick.update((val) => val + 1);
  }

  constructor() {
    this.initSocket();
  }

  public initSocket(): void {
    if (!this.socketConnected()) {
      this.socketService.connect('users');

      this.socketService
        .listen<User>('users:update')
        .pipe(debounceTime(100), takeUntilDestroyed())
        .subscribe(() => {
          console.log('test..');
          this.refresh();
        });
      this.socketConnected.set(true);
    }
  }
}
