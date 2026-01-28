import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TabsComponent } from '../../../../shared/components/tabs/tabs.component';
import { ADMIN_TABS } from '../../config/admin-tabs.config';

@Component({
  selector: 'app-admin',
  imports: [RouterOutlet, TabsComponent],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.scss',
})
export class AdminPageComponent {
  public readonly tabs = ADMIN_TABS;
}
