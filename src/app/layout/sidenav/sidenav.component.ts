import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  OnChanges,
  ViewChild,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { NAV_ITEMS } from '../navigation.config';

@Component({
  selector: 'app-sidenav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent {
  constructor(public auth: AuthService) {}

  @ViewChild('sidebar') sidebarRef!: ElementRef<HTMLElement>;

  @Input() open = false;
  @Output() close = new EventEmitter<boolean>();

  public navItems = NAV_ITEMS;

  public ngOnChanges() {
    if (this.open) {
      setTimeout(() => this.focusFirstSidebarItem());
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    if (!this.open) return;

    switch (event.key) {
      case 'Escape':
        this.close.emit();
        break;

      case 'Tab':
        this.trapFocus(event);
    }
  }

  private trapFocus(event: KeyboardEvent) {
    const sidebar = this.sidebarRef?.nativeElement;
    if (!sidebar) return;

    const focusableSelectors =
      'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])';

    const focusableElements = Array.from(sidebar.querySelectorAll<HTMLElement>(focusableSelectors));

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement as HTMLElement;

    if (event.shiftKey && activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  // Focus first item when sidebar opens
  private focusFirstSidebarItem() {
    const sidebar = this.sidebarRef?.nativeElement;
    if (!sidebar) return;

    const firstLink = sidebar.querySelector<HTMLElement>('a');
    firstLink?.focus();
  }
}
