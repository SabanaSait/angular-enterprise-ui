import { Component, Input, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { PermissionsPageComponent } from './permissions-page.component';
import { PermissionsFacade } from '../../facade/permissions.facade';
import { AdminPermission } from '../../models/permission.model';
import { PermissionsTableComponent } from '../../components/permissions-table/permissions-table.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';
import { LoadingStateComponent } from '../../../../shared/components/loading-state/loading-state.component';

@Component({
  selector: 'app-permissions-table',
  standalone: true,
  template: '',
})
class PermissionsTableStubComponent {
  @Input() permissions: AdminPermission[] = [];
}

@Component({
  selector: 'app-empty-state',
  standalone: true,
  template: '',
})
class EmptyStateStubComponent {}

@Component({
  selector: 'app-error-state',
  standalone: true,
  template: '',
})
class ErrorStateStubComponent {}

@Component({
  selector: 'app-loading-state',
  standalone: true,
  template: '',
})
class LoadingStateStubComponent {}

describe('PermissionsPageComponent', () => {
  let component: PermissionsPageComponent;
  let fixture: ComponentFixture<PermissionsPageComponent>;
  let facadeMock: {
    permissionsState: ReturnType<typeof signal>;
    permissions: ReturnType<typeof signal>;
    refresh: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    facadeMock = {
      permissionsState: signal({ status: 'loading' }),
      permissions: signal<AdminPermission[]>([]),
      refresh: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        PermissionsPageComponent,
        PermissionsTableStubComponent,
        EmptyStateStubComponent,
        ErrorStateStubComponent,
        LoadingStateStubComponent,
      ],
      providers: [{ provide: PermissionsFacade, useValue: facadeMock }],
    })
      .overrideComponent(PermissionsPageComponent, {
        remove: {
          imports: [
            PermissionsTableComponent,
            EmptyStateComponent,
            ErrorStateComponent,
            LoadingStateComponent,
          ],
        },
        add: {
          imports: [
            PermissionsTableStubComponent,
            EmptyStateStubComponent,
            ErrorStateStubComponent,
            LoadingStateStubComponent,
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(PermissionsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should refresh permissions on init', () => {
    expect(facadeMock.refresh).toHaveBeenCalledTimes(1);
  });

  it('should show loading state when loading', () => {
    facadeMock.permissionsState.set({ status: 'loading' });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-loading-state')).toBeTruthy();
  });

  it('should show error state when loading fails', () => {
    facadeMock.permissionsState.set({ status: 'error', error: new Error('fail') });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-error-state')).toBeTruthy();
  });

  it('should show empty state when no permissions', () => {
    facadeMock.permissionsState.set({ status: 'success', data: [] });
    facadeMock.permissions.set([]);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-empty-state')).toBeTruthy();
  });

  it('should render permissions table when permissions are present', () => {
    const permissions: AdminPermission[] = [
      { id: '1', code: 'VIEW_ADMIN', description: 'View admin' },
    ];
    facadeMock.permissionsState.set({ status: 'success', data: permissions });
    facadeMock.permissions.set(permissions);
    fixture.detectChanges();

    const table = fixture.debugElement.query(
      (el) => el.componentInstance instanceof PermissionsTableStubComponent,
    );
    expect(table.componentInstance.permissions).toEqual(permissions);
  });
});
