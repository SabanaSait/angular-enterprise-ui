import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardFacade } from '../facade/dashboard.facade';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';
import { ErrorStateComponent } from '../../../shared/components/error-state/error-state.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-dashboard-page',
  imports: [EmptyStateComponent, ErrorStateComponent, LoadingStateComponent, StatCardComponent],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
})
export class DashboardPageComponent {
  private readonly router = inject(Router);
  private readonly facade = inject(DashboardFacade);
  protected readonly metricsState = this.facade.metricsState;

  constructor() {}

  public goToUsers(): void {
    this.router.navigate(['users/']);
  }
}
