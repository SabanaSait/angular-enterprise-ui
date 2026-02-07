import { Component, Input, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { RolesPageComponent } from './roles-page.component';
import { RolesFacade } from '../../facade/roles.facade';
import { AdminRole } from '../../models/role.model';
import { RolesTableComponent } from '../../components/roles-table/roles-table.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';
import { LoadingStateComponent } from '../../../../shared/components/loading-state/loading-state.component';

@Component({
  selector: 'app-roles-table',
  standalone: true,
  template: '',
})
class RolesTableStubComponent {
  @Input() roles: AdminRole[] = [];
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

describe('RolesPageComponent', () => {
  let component: RolesPageComponent;
  let fixture: ComponentFixture<RolesPageComponent>;
  let facadeMock: {
    rolesState: ReturnType<typeof signal>;
    roles: ReturnType<typeof signal>;
    refresh: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    facadeMock = {
      rolesState: signal({ status: 'loading' }),
      roles: signal<AdminRole[]>([]),
      refresh: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        RolesPageComponent,
        RolesTableStubComponent,
        EmptyStateStubComponent,
        ErrorStateStubComponent,
        LoadingStateStubComponent,
      ],
      providers: [{ provide: RolesFacade, useValue: facadeMock }],
    })
      .overrideComponent(RolesPageComponent, {
        remove: {
          imports: [
            EmptyStateComponent,
            RolesTableComponent,
            ErrorStateComponent,
            LoadingStateComponent,
          ],
        },
        add: {
          imports: [
            EmptyStateStubComponent,
            RolesTableStubComponent,
            ErrorStateStubComponent,
            LoadingStateStubComponent,
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(RolesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should refresh roles on init', () => {
    expect(facadeMock.refresh).toHaveBeenCalledTimes(1);
  });

  it('should show loading state when loading', () => {
    facadeMock.rolesState.set({ status: 'loading' });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-loading-state')).toBeTruthy();
  });

  it('should show error state when loading fails', () => {
    facadeMock.rolesState.set({ status: 'error', error: new Error('fail') });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-error-state')).toBeTruthy();
  });

  it('should show empty state when no roles', () => {
    facadeMock.rolesState.set({ status: 'success', data: [] });
    facadeMock.roles.set([]);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-empty-state')).toBeTruthy();
  });

  it('should render roles table when roles are present', () => {
    const roles: AdminRole[] = [
      { id: '1', code: 'ADMIN', name: 'Admin', permissions: ['VIEW_ADMIN'], system: true },
    ];
    facadeMock.rolesState.set({ status: 'success', data: roles });
    facadeMock.roles.set(roles);
    fixture.detectChanges();

    const table = fixture.debugElement.query(
      (el) => el.componentInstance instanceof RolesTableStubComponent,
    );
    expect(table.componentInstance.roles).toEqual(roles);
  });
});
