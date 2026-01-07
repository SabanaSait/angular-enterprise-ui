import { Component } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { SidenavComponent } from '../sidenav/sidenav.component';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, SidenavComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  public isSidebarOpen = false;
  public lastFocusedElement: HTMLElement | null = null;

  constructor(private router: Router) {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.isSidebarOpen = false;
    });
  }

  public toggleSidebar() {
    if (!this.isSidebarOpen) {
      this.lastFocusedElement = document.activeElement as HTMLElement;
    }
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  public closeSidebar() {
    this.isSidebarOpen = false;
    this.lastFocusedElement?.focus();
  }
}
