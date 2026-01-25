import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardMetrics } from '../models/dashboard-metrics.model';
import { ApiService } from '../../../core/api/api.service';

@Injectable({ providedIn: 'root' })
export class DashboardApi {
  private readonly baseUrl = '/api/dashboard';

  constructor(private readonly api: ApiService) {}

  public getDashboardMetrics(): Observable<DashboardMetrics> {
    return this.api.get(`${this.baseUrl}/metrics`, {
      interceptorOptions: {
        retry: true,
        retryCount: 3,
      },
    });
  }
}
