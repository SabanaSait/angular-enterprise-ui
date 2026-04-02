import { computed, inject, Injectable, signal } from '@angular/core';
import { DashboardApi } from '../services/dashboard.api';
import { toDataStateSignal } from '../../../core/data-state/data-state.signal';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { DashboardMetrics } from '../models/dashboard-metrics.model';
import { SocketService } from '../../../core/services/socket.service';

@Injectable({ providedIn: 'root' })
export class DashboardFacade {
  private readonly dashboardApi = inject(DashboardApi);
  private readonly socketService = inject(SocketService);

  private readonly refreshTick = signal(0);

  // Ensure single socket connection to avoid duplicate event streams
  private readonly socketConnected = signal(false);

  // Socket stream (real-time updates)
  private readonly liveMetrics = signal<DashboardMetrics | null>(null);

  constructor() {
    this.initSocket();
  }

  private initSocket() {
    if (!this.socketConnected()) {
      this.socketService.connect('metrics');

      this.socketService
        .listen<DashboardMetrics>('metrics:update')
        .pipe(takeUntilDestroyed())
        .subscribe((data) => {
          this.liveMetrics.set({ ...data });
        });
      this.socketConnected.set(true);
    }
  }

  private readonly apiMetrics$ = toObservable(this.refreshTick).pipe(
    switchMap(() => this.dashboardApi.getDashboardMetrics()),
  );

  public readonly metricsState = toDataStateSignal(this.apiMetrics$, {
    emitLoadingOnNext: true,
  });

  // Socket updates override API data to enable real-time UI without breaking DataState flow
  public readonly metrics = computed(() => {
    const live = this.liveMetrics();
    const state = this.metricsState();

    return live ?? state.data;
  });

  public refresh(): void {
    this.refreshTick.update((val) => val + 1);
  }
}
