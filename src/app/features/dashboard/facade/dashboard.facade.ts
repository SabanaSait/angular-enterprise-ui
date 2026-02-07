import { inject, Injectable, signal } from '@angular/core';
import { DashboardApi } from '../services/dashboard.api';
import { toDataStateSignal } from '../../../core/data-state/data-state.signal';
import { toObservable } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardFacade {
  private readonly dashboardApi = inject(DashboardApi);
  private readonly refreshTick = signal(0);
  private readonly metrics$ = toObservable(this.refreshTick).pipe(
    switchMap(() => this.dashboardApi.getDashboardMetrics()),
  );

  public readonly metricsState = toDataStateSignal(this.metrics$, {
    emitLoadingOnNext: true,
  });
  constructor() {}

  public refresh(): void {
    this.refreshTick.update((val) => val + 1);
  }
}
