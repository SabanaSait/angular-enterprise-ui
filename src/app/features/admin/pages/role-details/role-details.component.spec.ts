import { Component, Input, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { RoleDetailsComponent } from './role-details.component';
import { RolesFacade } from '../../facade/roles.facade';
import { AdminRole } from '../../models/role.model';

@Component({
  selector: 'app-badge',
  standalone: true,
  template: '',
})
class BadgeStubComponent {
  @Input() label?: string;
  @Input() variant?: string;
}

@Pipe({
  name: 'permissionLabel',
  standalone: true,
})
class PermissionLabelStubPipe implements PipeTransform {
  transform(value: string) {
    return value;
  }
}

describe('RoleDetailsComponent', () => {
  let component: RoleDetailsComponent;
  let fixture: ComponentFixture<RoleDetailsComponent>;
  let routerMock: { navigateByUrl: ReturnType<typeof vi.fn> };
  let activatedRouteMock: { snapshot: { paramMap: { get: ReturnType<typeof vi.fn> } } };
  let rolesFacadeMock: { getRole: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    routerMock = {
      navigateByUrl: vi.fn(),
    };
    activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: vi.fn().mockReturnValue('ADMIN'),
        },
      },
    };
    rolesFacadeMock = {
      getRole: vi.fn(),
    };

    const role: AdminRole = {
      id: 'role-1',
      code: 'ADMIN',
      name: 'Admin',
      description: 'Admin role',
      permissions: ['VIEW_ADMIN', 'VIEW_USERS'],
      system: true,
    };
    rolesFacadeMock.getRole.mockReturnValue(of(role));

    await TestBed.configureTestingModule({
      imports: [RoleDetailsComponent, BadgeStubComponent, PermissionLabelStubPipe],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: RolesFacade, useValue: rolesFacadeMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RoleDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should request role details based on route param', () => {
    expect(rolesFacadeMock.getRole).toHaveBeenCalledWith('ADMIN');
  });

  it('should render role name and code', () => {
    const title = fixture.nativeElement.querySelector('h1');
    expect(title.textContent).toContain('Admin');

    const roleCode = fixture.nativeElement.querySelector('.role-code');
    expect(roleCode.textContent).toContain('ADMIN');
  });

  it('should filter permissions by group', () => {
    const group = component.permissionGroups.find((g) => g.key === 'admin');
    expect(group).toBeTruthy();

    const permissions = component.getPermissionsForGroup(group!, ['VIEW_ADMIN', 'VIEW_USERS']);
    expect(permissions).toEqual(['VIEW_ADMIN']);
  });

  it('should navigate back on cancel', () => {
    component.cancel();

    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/admin/roles');
  });
});
