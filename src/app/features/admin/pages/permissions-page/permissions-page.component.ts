import { Component, inject } from '@angular/core';
import { PermissionsFacade } from '../../facade/permissions.facade';
import { PermissionsTableComponent } from '../../components/permissions-table/permissions-table.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';
import { LoadingStateComponent } from '../../../../shared/components/loading-state/loading-state.component';

@Component({
  selector: 'app-permissions-page',
  imports: [
    PermissionsTableComponent,
    EmptyStateComponent,
    ErrorStateComponent,
    LoadingStateComponent,
  ],
  templateUrl: './permissions-page.component.html',
  styleUrl: './permissions-page.component.scss',
})
export class PermissionsPageComponent {
  private readonly facade = inject(PermissionsFacade);
  public readonly permissionsSate = this.facade.permissionsState;
  public readonly permissions = this.facade.permissions;
}
