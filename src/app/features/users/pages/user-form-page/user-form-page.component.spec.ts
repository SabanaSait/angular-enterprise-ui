import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { UserFormPageComponent } from './user-form-page.component';
import { UsersFacade } from '../../facade/users.facade';
import { UserStatus } from '../../models/user.model';
import { Role } from '../../../../core/auth/auth.types';

describe('UserFormPageComponent', () => {
  let component: UserFormPageComponent;
  let fixture: ComponentFixture<UserFormPageComponent>;
  let routerMock: { navigate: ReturnType<typeof vi.fn> };
  let activatedRouteMock: { snapshot: { paramMap: { get: ReturnType<typeof vi.fn> } } };
  let facadeMock: {
    getUser: ReturnType<typeof vi.fn>;
    createUser: ReturnType<typeof vi.fn>;
    updateUser: ReturnType<typeof vi.fn>;
  };

  const waitForSignal = () => new Promise((resolve) => setTimeout(resolve, 10));

  beforeEach(async () => {
    routerMock = {
      navigate: vi.fn(),
    };
    activatedRouteMock = {
      snapshot: {
        paramMap: {
          get: vi.fn().mockReturnValue(null),
        },
      },
    };
    facadeMock = {
      getUser: vi.fn(),
      createUser: vi.fn(),
      updateUser: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [UserFormPageComponent],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
        { provide: UsersFacade, useValue: facadeMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UserFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should default to create mode when no id is present', () => {
    expect(component.isEdit()).toBe(false);
  });

  it('should populate form when editing an existing user', async () => {
    activatedRouteMock.snapshot.paramMap.get.mockReturnValue('user-1');
    const user = {
      id: 'user-1',
      name: 'Ada',
      email: 'ada@test.com',
      role: 'ADMIN' as Role,
      status: UserStatus.Active,
    };
    facadeMock.getUser.mockReturnValue(of(user));

    fixture = TestBed.createComponent(UserFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await waitForSignal();

    expect(component.isEdit()).toBe(true);
    expect(component.form.value).toMatchObject({
      name: 'Ada',
      email: 'ada@test.com',
      role: 'ADMIN',
      status: UserStatus.Active,
    });
  });

  it('should call createUser when submitting in create mode', () => {
    component.form.setValue({
      name: 'New User',
      email: 'new@test.com',
      role: 'USER',
      status: UserStatus.Active,
    });

    component.submit();

    expect(facadeMock.createUser).toHaveBeenCalledWith({
      name: 'New User',
      email: 'new@test.com',
      role: 'USER',
      status: UserStatus.Active,
    });
    expect(routerMock.navigate).toHaveBeenCalledWith(['/users']);
  });

  it('should call updateUser when submitting in edit mode', () => {
    activatedRouteMock.snapshot.paramMap.get.mockReturnValue('user-2');
    facadeMock.getUser.mockReturnValue(of(null));

    fixture = TestBed.createComponent(UserFormPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.form.setValue({
      name: 'Updated User',
      email: 'updated@test.com',
      role: 'ADMIN',
      status: UserStatus.Inactive,
    });

    component.submit();

    expect(facadeMock.updateUser).toHaveBeenCalledWith({
      id: 'user-2',
      name: 'Updated User',
      email: 'updated@test.com',
      role: 'ADMIN',
      status: UserStatus.Inactive,
    });
    expect(routerMock.navigate).toHaveBeenCalledWith(['/users']);
  });

  it('should not submit when form is invalid', () => {
    component.form.setValue({
      name: '',
      email: 'bad-email',
      role: '',
      status: UserStatus.Active,
    });

    component.submit();

    expect(facadeMock.createUser).not.toHaveBeenCalled();
    expect(facadeMock.updateUser).not.toHaveBeenCalled();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should navigate back on cancel', () => {
    component.cancel();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/users']);
  });

  it('should report required validators correctly', () => {
    expect(component.isRequired('name')).toBe(true);
    expect(component.isRequired('email')).toBe(true);
    expect(component.isRequired('role')).toBe(true);
  });

  it('should report invalid control only when touched or dirty', () => {
    component.form.controls.name.setValue('');
    expect(component.isInvalidControl('name')).toBe(false);

    component.form.controls.name.markAsTouched();
    expect(component.isInvalidControl('name')).toBe(true);
  });
});
