import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { AuthService } from '../../core/auth/auth.service';
import { ROLE_OPTIONS } from '../../core/auth/auth.constants';
import { Role } from '../../core/auth/auth.types';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;

  let authMock: { login: ReturnType<typeof vi.fn> };
  let routerMock: { navigateByUrl: ReturnType<typeof vi.fn> };
  let activatedRouteMock: { snapshot: { queryParamMap: { get: ReturnType<typeof vi.fn> } } };

  beforeEach(async () => {
    authMock = {
      login: vi.fn(),
    };

    routerMock = {
      navigateByUrl: vi.fn(),
    };

    activatedRouteMock = {
      snapshot: {
        queryParamMap: {
          get: vi.fn(),
        },
      },
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  /* --------------------------------------------
   * Basics
   * ------------------------------------------ */

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default role', () => {
    expect(component.loginForm.value.userRole).toBe('USER');
    expect(component.loginForm.valid).toBe(true);
  });

  it('should expose role options', () => {
    expect(component.roleOptions).toEqual(ROLE_OPTIONS);
  });

  /* --------------------------------------------
   * Template
   * ------------------------------------------ */

  it('should render role select options', () => {
    const options = fixture.nativeElement.querySelectorAll('option');
    expect(options.length).toBe(ROLE_OPTIONS.length);
  });

  it('should disable login button when form is invalid', () => {
    component.loginForm.controls.userRole.setValue('');
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button.disabled).toBe(true);
  });

  /* --------------------------------------------
   * Login behavior
   * ------------------------------------------ */

  it('should call auth.login with selected role', () => {
    component.loginForm.controls.userRole.setValue('ADMIN' as Role);

    component.login();

    expect(authMock.login).toHaveBeenCalledWith('ADMIN');
  });

  it('should navigate to dashboard by default after login', () => {
    activatedRouteMock.snapshot.queryParamMap.get.mockReturnValue(null);

    component.login();

    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/dashboard');
  });

  it('should navigate to redirect query param if provided', () => {
    activatedRouteMock.snapshot.queryParamMap.get.mockReturnValue('/users');

    component.login();

    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/users');
  });

  /* --------------------------------------------
   * Form submit integration
   * ------------------------------------------ */

  it('should submit form on button click', () => {
    const spy = vi.spyOn(component, 'login');

    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));

    expect(spy).toHaveBeenCalled();
  });

  it('should call auth.login and navigate when form is submitted', () => {
    activatedRouteMock.snapshot.queryParamMap.get.mockReturnValue('/dashboard');
    component.loginForm.controls.userRole.setValue('ADMIN' as Role);

    const form = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));

    expect(authMock.login).toHaveBeenCalledWith('ADMIN');
    expect(routerMock.navigateByUrl).toHaveBeenCalledWith('/dashboard');
  });
});
