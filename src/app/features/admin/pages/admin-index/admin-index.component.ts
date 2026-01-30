import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';
import { TabsComponent } from '../../../../shared/components/tabs/tabs.component';
import { ADMIN_TABS } from '../../config/admin-tabs.config';

@Component({
  selector: 'app-admin-index',
  imports: [RouterOutlet, TabsComponent],
  templateUrl: './admin-index.component.html',
  styleUrl: './admin-index.component.scss',
})
export class AdminIndexComponent {
  private readonly authService = inject(AuthService);
  public readonly adminTabs = ADMIN_TABS;

  public readonly tabs = this.adminTabs.filter(
    (tab) => !tab.requiredPermission || this.authService.hasAccess(tab.requiredPermission),
  );
}
