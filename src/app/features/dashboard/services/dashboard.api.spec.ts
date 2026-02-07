import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { DashboardApi } from './dashboard.api';
import { API_INTERCEPTOR_OPTIONS } from '../../../core/api/api.model';
import { DashboardMetrics } from '../models/dashboard-metrics.model';

describe('DashboardApi', () => {
  let api: DashboardApi;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DashboardApi, provideHttpClient(), provideHttpClientTesting()],
    });

    api = TestBed.inject(DashboardApi);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should request dashboard metrics with retry interceptor options', () => {
    const expected: DashboardMetrics = {
      totalUsers: 10,
      activeUsers: 7,
      inactiveUsers: 3,
      adminUsersCount: 2,
      supervisorsCount: 1,
      generalUsersCount: 7,
    };

    api.getDashboardMetrics().subscribe((metrics) => {
      expect(metrics).toEqual(expected);
    });

    const req = httpMock.expectOne(
      (req) => req.method === 'GET' && req.url === '/api/dashboard/metrics',
    );
    expect(req.request.context.get(API_INTERCEPTOR_OPTIONS)).toEqual({
      retry: true,
      retryCount: 3,
    });

    req.flush(expected);
  });
});
