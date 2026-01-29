import { computed, inject, Injectable } from '@angular/core';
import { PermissionsApi } from '../services/permissions.api';
import { toDataStateSignal } from '../../../core/data-state/data-state.signal';
import { AdminPermission } from '../models/permission.model';

@Injectable({
  providedIn: 'root',
})
export class PermissionsFacade {
  private permissionsApi = inject(PermissionsApi);
  private readonly permissions$ = this.permissionsApi.getPermissions();

  public readonly permissionsState = toDataStateSignal<AdminPermission[]>(this.permissions$, {
    emitLoadingOnNext: true,
  });

  public readonly permissions = computed(() => this.permissionsState().data || []);

  /* Intents methods */
}
