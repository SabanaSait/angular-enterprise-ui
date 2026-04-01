import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardFacade } from '../facade/dashboard.facade';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';
import { ErrorStateComponent } from '../../../shared/components/error-state/error-state.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { SocketService } from '../../../core/services/socket.service';

@Component({
  selector: 'app-dashboard-page',
  imports: [EmptyStateComponent, ErrorStateComponent, LoadingStateComponent, StatCardComponent],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
})
export class DashboardPageComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly facade = inject(DashboardFacade);
  protected readonly metricsState = this.facade.metricsState;
  private readonly socketService = inject(SocketService);

  constructor() {}

  public ngOnInit(): void {
    this.facade.refresh();
    this.socketService.connect('metrics');

    this.socketService.listen('metrics:update').subscribe((data) => {
      console.log('REALTIME DATA:', data);
    });
  }

  public goToUsers(): void {
    this.router.navigate(['users/']);
  }
}
