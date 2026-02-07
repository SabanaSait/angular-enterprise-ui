import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { signal } from '@angular/core';

import { UsersPageComponent } from './users-page.component';
import { UsersFacade } from '../../facade/users.facade';
import { AuthService } from '../../../../core/auth/auth.service';
import { User } from '../../models/user.model';
import { SortDirection } from '../../models/users-query.model';
import { UsersTableComponent } from '../../components/users-table/users-table.component';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';

/* --------------------------------------------
 * Stub: UsersTableComponent
 * ------------------------------------------ */
@Component({
  selector: 'app-users-table',
  standalone: true,
  template: '',
})
class UsersTableStubComponent {
  @Input() users: User[] = [];
  @Input() pageNumber?: number;
  @Input() pageSize?: number;
  @Input() sortBy?: any;
  @Input() sortDirection?: SortDirection;
  @Input() total?: number;
  @Input() loading = false;
  @Input() canManageUsers = false;

  @Output() pageChange = new EventEmitter<number>();
  @Output() sortChange = new EventEmitter<{ by: any; direction: SortDirection }>();
  @Output() addUser = new EventEmitter<void>();
  @Output() editUser = new EventEmitter<User>();
  @Output() deleteUser = new EventEmitter<User>();
}

/* --------------------------------------------
 * Stub: ErrorStateComponent
 * ------------------------------------------ */
@Component({
  selector: 'app-error-state',
  standalone: true,
  template: '',
})
class ErrorStateStubComponent {}

describe('UsersPageComponent', () => {
  let fixture: ComponentFixture<UsersPageComponent>;
  let component: UsersPageComponent;

  let facadeMock: {
    usersState: any;
    loading: any;
    query: any;
    refresh: ReturnType<typeof vi.fn>;
    setPage: ReturnType<typeof vi.fn>;
    setSort: ReturnType<typeof vi.fn>;
    deleteUser: ReturnType<typeof vi.fn>;
  };

  let router: Router;
  let authServiceMock: { hasAccess: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    authServiceMock = {
      hasAccess: vi.fn().mockReturnValue(true),
    };

    facadeMock = {
      usersState: signal({ status: 'success', data: null }),
      loading: signal(false),
      query: signal({ pageNumber: 1, pageSize: 20, sortBy: 'name', sortDirection: 'asc' }),
      refresh: vi.fn(),
      setPage: vi.fn(),
      setSort: vi.fn(),
      deleteUser: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [UsersPageComponent, UsersTableStubComponent, ErrorStateStubComponent],
      providers: [
        { provide: UsersFacade, useValue: facadeMock },
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
        {
          provide: Router,
          useValue: {
            navigate: vi.fn(),
          },
        },
      ],
    })
      .overrideComponent(UsersPageComponent, {
        remove: { imports: [UsersTableComponent, ErrorStateComponent] },
        add: { imports: [UsersTableStubComponent, ErrorStateStubComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(UsersPageComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  /* --------------------------------------------
   * Basics
   * ------------------------------------------ */

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /* --------------------------------------------
   * Lifecycle
   * ------------------------------------------ */

  it('should refresh users on init', () => {
    expect(facadeMock.refresh).toHaveBeenCalledOnce();
  });

  /* --------------------------------------------
   * Pagination & sorting
   * ------------------------------------------ */

  it('should delegate page change to facade', () => {
    component.setPageNumber(2);

    expect(facadeMock.setPage).toHaveBeenCalledWith(2);
  });

  it('should delegate sort change to facade', () => {
    component.setSort({ by: 'email', direction: 'desc' });

    expect(facadeMock.setSort).toHaveBeenCalledWith('email', 'desc');
  });

  /* --------------------------------------------
   * Navigation
   * ------------------------------------------ */

  it('should navigate to create user page', () => {
    component.onAddUser();

    expect(router.navigate).toHaveBeenCalledWith(['users/create']);
  });

  it('should navigate to edit user page', () => {
    const user = { id: '123' } as User;

    component.onEditUser(user);

    expect(router.navigate).toHaveBeenCalledWith(['users', '123', 'edit']);
  });

  /* --------------------------------------------
   * Deletion
   * ------------------------------------------ */

  it('should delegate delete to facade', () => {
    const user = { id: '1' } as User;

    component.onDeleteUser(user);

    expect(facadeMock.deleteUser).toHaveBeenCalledWith('1');
  });

  /* --------------------------------------------
   * Template behavior
   * ------------------------------------------ */

  it('should render error state when users load fails', () => {
    facadeMock.usersState.set({ status: 'error', error: new Error('fail') });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-error-state')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('app-users-table')).toBeFalsy();
  });

  it('should render users table when users load succeeds', () => {
    facadeMock.usersState.set({
      status: 'success',
      data: {
        entities: [{ id: '1' } as User],
        total: 1,
        pageNumber: 1,
        pageSize: 20,
        sortBy: 'name',
        sortDirection: 'asc',
      },
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-users-table')).toBeTruthy();
  });

  it('should hide add button when user cannot manage users', async () => {
    authServiceMock.hasAccess.mockReturnValue(false);

    fixture = TestBed.createComponent(UsersPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button.btn.btn-primary');
    expect(button).toBeFalsy();
  });

  it('should disable add button when loading', () => {
    facadeMock.usersState.set({ status: 'loading', data: null });
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button.btn.btn-primary');
    expect(button.disabled).toBe(true);
  });

  it('should wire users table outputs to facade and navigation', () => {
    facadeMock.usersState.set({
      status: 'success',
      data: {
        entities: [{ id: '1' } as User],
        total: 1,
        pageNumber: 1,
        pageSize: 20,
        sortBy: 'name',
        sortDirection: 'asc',
      },
    });
    fixture.detectChanges();

    const table = fixture.debugElement.query(
      (el) => el.componentInstance instanceof UsersTableStubComponent,
    );

    table.componentInstance.pageChange.emit(3);
    table.componentInstance.sortChange.emit({ by: 'email', direction: 'desc' });
    table.componentInstance.addUser.emit();
    table.componentInstance.editUser.emit({ id: '42' } as User);
    table.componentInstance.deleteUser.emit({ id: '99' } as User);

    expect(facadeMock.setPage).toHaveBeenCalledWith(3);
    expect(facadeMock.setSort).toHaveBeenCalledWith('email', 'desc');
    expect(router.navigate).toHaveBeenCalledWith(['users/create']);
    expect(router.navigate).toHaveBeenCalledWith(['users', '42', 'edit']);
    expect(facadeMock.deleteUser).toHaveBeenCalledWith('99');
  });
});
