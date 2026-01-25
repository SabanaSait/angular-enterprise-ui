import { inject, Injectable } from '@angular/core';
import { DashboardApi } from '../services/dashboard.api';
import { toDataStateSignal } from '../../../core/data-state/data-state.signal';

@Injectable({ providedIn: 'root' })
export class DashboardFacade {
  private readonly dashboardApi = inject(DashboardApi);
  private readonly metrics$ = this.dashboardApi.getDashboardMetrics();

  public readonly metricsState = toDataStateSignal(this.metrics$, {
    emitLoadingOnNext: true,
  });
  constructor() {}
}
