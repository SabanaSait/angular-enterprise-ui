import { computed, inject, Injectable, signal } from '@angular/core';
import { PermissionsApi } from '../services/permissions.api';
import { toDataStateSignal } from '../../../core/data-state/data-state.signal';
import { AdminPermission } from '../models/permission.model';
import { toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PermissionsFacade {
  private permissionsApi = inject(PermissionsApi);
  private readonly refreshTick = signal(0);
  private readonly permissions$ = toObservable(this.refreshTick).pipe(
    switchMap(() => this.permissionsApi.getPermissions()),
  );

  public readonly permissionsState = toDataStateSignal<AdminPermission[]>(this.permissions$, {
    emitLoadingOnNext: true,
  });

  public readonly permissions = computed(() => this.permissionsState().data || []);

  /* Intents methods */
  public refresh(): void {
    this.refreshTick.update((val) => val + 1);
  }
}
