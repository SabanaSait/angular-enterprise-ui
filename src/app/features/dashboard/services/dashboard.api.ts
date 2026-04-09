import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardMetrics } from '../models/dashboard-metrics.model';
import { ApiService } from '../../../core/api/api.service';

@Injectable({ providedIn: 'root' })
export class DashboardApi {
  private readonly api = inject(ApiService);

  private readonly baseUrl = '/api/dashboard/metrics';

  public getDashboardMetrics(): Observable<DashboardMetrics> {
    return this.api.get(`${this.baseUrl}`, {
      interceptorOptions: {
        retry: true,
        retryCount: 3,
      },
    });
  }
}
