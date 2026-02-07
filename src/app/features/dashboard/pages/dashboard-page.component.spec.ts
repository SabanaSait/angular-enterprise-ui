import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { vi } from 'vitest';

import { DashboardPageComponent } from './dashboard-page.component';
import { DashboardFacade } from '../facade/dashboard.facade';
import { DataState } from '../../../core/data-state/data-state.model';
import { DashboardMetrics } from '../models/dashboard-metrics.model';
import { ErrorStateComponent } from '../../../shared/components/error-state/error-state.component';
import { LoadingStateComponent } from '../../../shared/components/loading-state/loading-state.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';

@Component({
  selector: 'app-loading-state',
  standalone: true,
  template: '',
})
class LoadingStateStubComponent {}

@Component({
  selector: 'app-error-state',
  standalone: true,
  template: '',
})
class ErrorStateStubComponent {
  @Input() errorTitle?: string;
  @Input() errorDescription?: string;
}

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: `<button data-testid="empty-action" (click)="action.emit()">action</button>`,
})
class EmptyStateStubComponent {
  @Input() heading?: string;
  @Input() description?: string;
  @Input() actionLabel?: string;
  @Output() action = new EventEmitter<void>();
}

@Component({
  selector: 'app-stat-card',
  standalone: true,
  template: '',
})
class StatCardStubComponent {
  @Input() label?: string;
  @Input() value?: number;
}

describe('DashboardPageComponent', () => {
  let component: DashboardPageComponent;
  let fixture: ComponentFixture<DashboardPageComponent>;
  let routerMock: { navigate: ReturnType<typeof vi.fn> };
  let facadeMock: { refresh: ReturnType<typeof vi.fn>; metricsState: ReturnType<typeof signal> };

  const metricsState = signal<DataState<DashboardMetrics>>({ status: 'loading' });

  beforeEach(async () => {
    routerMock = {
      navigate: vi.fn(),
    };

    facadeMock = {
      refresh: vi.fn(),
      metricsState,
    };

    await TestBed.configureTestingModule({
      imports: [
        DashboardPageComponent,
        LoadingStateStubComponent,
        ErrorStateStubComponent,
        EmptyStateStubComponent,
        StatCardStubComponent,
      ],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: DashboardFacade, useValue: facadeMock },
      ],
    })
      .overrideComponent(DashboardPageComponent, {
        remove: {
          imports: [
            EmptyStateComponent,
            ErrorStateComponent,
            LoadingStateComponent,
            StatCardComponent,
          ],
        },
        add: {
          imports: [
            EmptyStateStubComponent,
            ErrorStateStubComponent,
            LoadingStateStubComponent,
            StatCardStubComponent,
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(DashboardPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should refresh metrics on init', () => {
    expect(facadeMock.refresh).toHaveBeenCalledTimes(1);
  });

  it('should show loading state when metrics are loading', () => {
    metricsState.set({ status: 'loading' });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-loading-state')).toBeTruthy();
  });

  it('should show error state when metrics fail', () => {
    metricsState.set({ status: 'error', error: new Error('Failed') });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-error-state')).toBeTruthy();
  });

  it('should show empty state when there are no users', () => {
    metricsState.set({
      status: 'success',
      data: {
        totalUsers: 0,
        activeUsers: 0,
        inactiveUsers: 0,
        adminUsersCount: 0,
        supervisorsCount: 0,
        generalUsersCount: 0,
      },
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-empty-state')).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll('app-stat-card').length).toBe(0);
  });

  it('should show stat cards when metrics are available', () => {
    metricsState.set({
      status: 'success',
      data: {
        totalUsers: 10,
        activeUsers: 7,
        inactiveUsers: 3,
        adminUsersCount: 2,
        supervisorsCount: 1,
        generalUsersCount: 7,
      },
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('app-stat-card').length).toBe(6);
  });

  it('should navigate to users when empty state action is triggered', () => {
    metricsState.set({
      status: 'success',
      data: {
        totalUsers: 0,
        activeUsers: 0,
        inactiveUsers: 0,
        adminUsersCount: 0,
        supervisorsCount: 0,
        generalUsersCount: 0,
      },
    });
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('[data-testid="empty-action"]');
    button.click();

    expect(routerMock.navigate).toHaveBeenCalledWith(['users/']);
  });
});
