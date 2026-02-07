import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { vi } from 'vitest';

import { RolesTableComponent } from './roles-table.component';
import { AdminRole } from '../../models/role.model';
import { BadgeComponent } from '../../../../shared/components/badge/badge.component';

@Component({
  selector: 'app-badge',
  standalone: true,
  template: '',
})
class BadgeStubComponent {
  @Input() label?: string;
  @Input() variant?: string;
}

describe('RolesTableComponent', () => {
  let component: RolesTableComponent;
  let fixture: ComponentFixture<RolesTableComponent>;
  let routerMock: { navigate: ReturnType<typeof vi.fn> };
  const render = () => fixture.detectChanges(false);
  const waitForView = async () => {
    render();
    await fixture.whenStable();
    render();
  };

  beforeEach(async () => {
    routerMock = {
      navigate: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [RolesTableComponent, BadgeStubComponent],
      providers: [{ provide: Router, useValue: routerMock }],
    })
      .overrideComponent(RolesTableComponent, {
        remove: { imports: [BadgeComponent] },
        add: { imports: [BadgeStubComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(RolesTableComponent);
    component = fixture.componentInstance;
    await waitForView();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a row for each role', async () => {
    component.roles = [
      {
        id: '1',
        code: 'ADMIN',
        name: 'Admin',
        description: 'Admin role',
        permissions: [],
        system: true,
      },
      {
        id: '2',
        code: 'USER',
        name: 'User',
        description: 'User role',
        permissions: [],
        system: false,
      },
    ] as AdminRole[];
    await waitForView();

    expect(component.roles.length).toBe(2);
  });

  it('should navigate to role details when action is clicked', async () => {
    component.roles = [
      {
        id: '1',
        code: 'ADMIN',
        name: 'Admin',
        description: 'Admin role',
        permissions: [],
        system: true,
      },
    ] as AdminRole[];
    await waitForView();

    component.viewRoleDetails('1');

    expect(routerMock.navigate).toHaveBeenCalledWith(['admin', 'roles', '1']);
  });

  it('should render system badge for system roles', async () => {
    component.roles = [
      {
        id: '1',
        code: 'ADMIN',
        name: 'Admin',
        description: 'Admin role',
        permissions: [],
        system: true,
      },
    ] as AdminRole[];
    await waitForView();

    expect(component.roles[0].system).toBe(true);
  });
});
