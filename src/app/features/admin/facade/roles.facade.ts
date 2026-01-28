import { signal, Injectable, inject, computed } from '@angular/core';
import { RolesApi } from '../services/roles.api';
import { toDataStateSignal } from '../../../core/data-state/data-state.signal';
import { AdminRole } from '../models/role.model';

@Injectable({
  providedIn: 'root',
})
export class RolesFacade {
  private readonly rolesApi = inject(RolesApi);
  private readonly roles$ = this.rolesApi.getRoles();

  public readonly rolesState = toDataStateSignal<AdminRole[]>(this.roles$, {
    emitLoadingOnNext: true,
  });

  public readonly roles = computed(() => this.rolesState().data ?? []);

  /* Intents */
}
