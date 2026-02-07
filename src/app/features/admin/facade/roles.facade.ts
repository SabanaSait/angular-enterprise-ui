import { Injectable, inject, computed, signal } from '@angular/core';
import { RolesApi } from '../services/roles.api';
import { toDataStateSignal } from '../../../core/data-state/data-state.signal';
import { AdminRole } from '../models/role.model';
import { toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RolesFacade {
  private readonly rolesApi = inject(RolesApi);
  private readonly refreshTick = signal(0);
  private readonly roles$ = toObservable(this.refreshTick).pipe(
    switchMap(() => this.rolesApi.getRoles()),
  );

  public readonly rolesState = toDataStateSignal<AdminRole[]>(this.roles$, {
    emitLoadingOnNext: true,
  });

  public readonly roles = computed(() => this.rolesState().data ?? []);

  /* Intents methods */
  public getRole(id: string) {
    return this.rolesApi.getRole(id);
  }

  public refresh(): void {
    this.refreshTick.update((val) => val + 1);
  }
}
