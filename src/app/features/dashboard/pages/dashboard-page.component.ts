import { Component, inject, signal } from '@angular/core';
import { DashboardFacade } from '../facade/dashboard.facade';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';

@Component({
  selector: 'app-dashboard-page',
  imports: [StatCardComponent],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
})
export class DashboardPageComponent {
  private readonly facade = inject(DashboardFacade);
  protected readonly metricsState = this.facade.metricsState;

  constructor() {}
}
