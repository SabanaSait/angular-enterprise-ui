import { Component, inject, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { filter } from 'rxjs';
import { AuthService } from '../../core/auth/auth.service';
import { SidenavComponent } from '../sidenav/sidenav.component';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, SidenavComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  public isSidebarOpen = signal(false);
  public lastFocusedElement: HTMLElement | null = null;

  private readonly breakpointObserver = inject(BreakpointObserver);

  constructor(
    private router: Router,
    public readonly auth: AuthService,
  ) {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.isSidebarOpen.set(false);
    });
  }

  public ngOnInit() {
    this.breakpointObserver
      .observe(['(max-width: 768px)'])
      .subscribe(({ matches }: BreakpointState) => {
        if (!matches) {
          // Desktop mode
          this.isSidebarOpen.set(false);
        }
      });
  }

  public toggleSidebar() {
    if (!this.isSidebarOpen) {
      this.lastFocusedElement = document.activeElement as HTMLElement;
    }
    this.isSidebarOpen.update((val) => !val);
  }

  public closeSidebar() {
    this.isSidebarOpen.set(false);
    this.lastFocusedElement?.focus();
  }

  public logout() {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
