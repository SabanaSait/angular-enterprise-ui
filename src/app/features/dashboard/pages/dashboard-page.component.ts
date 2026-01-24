import { Component } from '@angular/core';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';

@Component({
  selector: 'app-dashboard-page',
  imports: [StatCardComponent],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
})
export class DashboardPageComponent {
  // mock values
  public totalUsers = 100;
  public activeUsers = 50;
  public inActiveUsers = 50;
}
