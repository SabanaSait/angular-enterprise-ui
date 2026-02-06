import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Event, NavigationEnd, Router, provideRouter } from '@angular/router';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Subject, of } from 'rxjs';

import { MainLayoutComponent } from './main-layout.component';
import { AuthService } from '../../core/auth/auth.service';
import { SidenavComponent } from '../sidenav/sidenav.component';

// Dummy routed component
@Component({ template: '' })
class DummyComponent {}

// Stub Sidenav Component
@Component({
  selector: 'app-sidenav',
  standalone: true,
  template: '<nav data-testid="sidenav"></nav>',
})
class SidenavStubComponent {
  @Input() open = false;
  @Output() toastClose = new EventEmitter<void>();
}

describe('MainLayoutComponent', () => {
  let fixture: ComponentFixture<MainLayoutComponent>;
  let component: MainLayoutComponent;

  let router: Router;
  let routerEvents$: Subject<Event>;

  const authMock = {
    logout: vi.fn(),
  };

  const breakpointObserverMock = {
    observe: vi.fn(),
  };

  beforeEach(async () => {
    routerEvents$ = new Subject<Event>();

    breakpointObserverMock.observe.mockReturnValue(
      of<BreakpointState>({
        matches: true, // mobile
        breakpoints: {},
      }),
    );

    await TestBed.configureTestingModule({
      imports: [MainLayoutComponent, SidenavStubComponent],
      providers: [
        provideRouter([
          { path: 'login', component: DummyComponent },
          { path: 'users', component: DummyComponent },
        ]),
        { provide: AuthService, useValue: authMock },
        { provide: BreakpointObserver, useValue: breakpointObserverMock },
      ],
    })
      .overrideComponent(MainLayoutComponent, {
        remove: { imports: [SidenavComponent] },
        add: { imports: [SidenavStubComponent] },
      })
      .compileComponents();

    router = TestBed.inject(Router);

    vi.spyOn(router, 'events', 'get').mockReturnValue(routerEvents$.asObservable());

    fixture = TestBed.createComponent(MainLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    routerEvents$.complete();
    vi.restoreAllMocks();
  });

  /* --------------------------------------------
   * Tests
   * ------------------------------------------ */

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle sidebar open state', () => {
    expect(component.isSidebarOpen()).toBe(false);

    component.toggleSidebar();
    expect(component.isSidebarOpen()).toBe(true);

    component.toggleSidebar();
    expect(component.isSidebarOpen()).toBe(false);
  });

  it('should store last focused element when opening sidebar', () => {
    const menuButton = fixture.nativeElement.querySelector('.menu-btn') as HTMLElement;

    menuButton.focus();
    component.toggleSidebar();

    expect(component.lastFocusedElement).toBe(menuButton);
  });

  it('should close sidebar on NavigationEnd', () => {
    component.isSidebarOpen.set(true);

    routerEvents$.next(new NavigationEnd(1, '/users', '/users'));
    fixture.detectChanges();

    expect(component.isSidebarOpen()).toBe(false);
  });

  it('should close sidebar and restore focus', () => {
    const menuButton = fixture.nativeElement.querySelector('.menu-btn') as HTMLElement;

    menuButton.focus();
    component.toggleSidebar();

    component.closeSidebar();

    expect(component.isSidebarOpen()).toBe(false);
    expect(document.activeElement).toBe(menuButton);
  });

  it('should close sidebar when switching to desktop breakpoint', () => {
    component.isSidebarOpen.set(true);

    breakpointObserverMock.observe.mockReturnValueOnce(
      of<BreakpointState>({
        matches: false, // desktop
        breakpoints: {},
      }),
    );

    component.ngOnInit();
    fixture.detectChanges();

    expect(component.isSidebarOpen()).toBe(false);
  });

  it('should logout and navigate to login', async () => {
    const navigateSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);

    component.logout();

    expect(authMock.logout).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith('/login');
  });

  it('should render header with navigation controls', () => {
    const header = fixture.nativeElement.querySelector('header[role="banner"]');
    const menuButton = fixture.nativeElement.querySelector('.menu-btn');
    const logoutButton = fixture.nativeElement.querySelector('.btn-logout');

    expect(header).toBeTruthy();
    expect(menuButton).toBeTruthy();
    expect(logoutButton).toBeTruthy();
  });
});
