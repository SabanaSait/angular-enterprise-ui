import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { vi } from 'vitest';

import { DashboardFacade } from './dashboard.facade';
import { DashboardApi } from '../services/dashboard.api';

describe('DashboardFacade', () => {
  let facade: DashboardFacade;
  let dashboardApiMock: {
    getDashboardMetrics: ReturnType<typeof vi.fn>;
  };

  const metrics = {
    totalUsers: 10,
    activeUsers: 7,
  };

  const waitForSignal = () => new Promise((resolve) => setTimeout(resolve, 10));

  beforeEach(() => {
    dashboardApiMock = {
      getDashboardMetrics: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [DashboardFacade, { provide: DashboardApi, useValue: dashboardApiMock }],
    });

    facade = TestBed.inject(DashboardFacade);
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  it('should start in loading state', () => {
    const metricsSubject = new Subject<typeof metrics>();
    dashboardApiMock.getDashboardMetrics.mockReturnValue(metricsSubject.asObservable());

    const metricsState = TestBed.runInInjectionContext(() => facade.metricsState);
    const state = metricsState();
    expect(state.status).toBe('loading');
  });

  it('should emit success state when metrics load', async () => {
    const metricsSubject = new Subject<typeof metrics>();
    dashboardApiMock.getDashboardMetrics.mockReturnValue(metricsSubject.asObservable());

    const metricsState = TestBed.runInInjectionContext(() => facade.metricsState);
    expect(metricsState().status).toBe('loading');

    facade.refresh();
    await waitForSignal();

    metricsSubject.next(metrics);
    await waitForSignal();

    expect(metricsState().status).toBe('success');
    expect(metricsState().data).toEqual(metrics);
  });

  it('should emit error state when api fails', async () => {
    const metricsSubject = new Subject<typeof metrics>();
    dashboardApiMock.getDashboardMetrics.mockReturnValue(metricsSubject.asObservable());

    const metricsState = TestBed.runInInjectionContext(() => facade.metricsState);
    expect(metricsState().status).toBe('loading');

    facade.refresh();
    await waitForSignal();

    metricsSubject.error(new Error('API failed'));
    await waitForSignal();

    expect(metricsState().status).toBe('error');
    expect(metricsState().error).toBeTruthy();
  });

  it('should refetch metrics when refresh is called', async () => {
    const firstSubject = new Subject<typeof metrics>();
    const secondSubject = new Subject<typeof metrics>();
    dashboardApiMock.getDashboardMetrics
      .mockReturnValueOnce(firstSubject.asObservable())
      .mockReturnValueOnce(secondSubject.asObservable());

    const metricsState = TestBed.runInInjectionContext(() => facade.metricsState);
    metricsState();
    await waitForSignal();
    expect(dashboardApiMock.getDashboardMetrics).toHaveBeenCalledTimes(1);

    facade.refresh();
    await waitForSignal();

    expect(dashboardApiMock.getDashboardMetrics).toHaveBeenCalledTimes(2);
  });
});
