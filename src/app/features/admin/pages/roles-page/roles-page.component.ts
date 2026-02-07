import { Component, inject, OnInit } from '@angular/core';
import { RolesFacade } from '../../facade/roles.facade';
import { RolesTableComponent } from '../../components/roles-table/roles-table.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state.component';
import { LoadingStateComponent } from '../../../../shared/components/loading-state/loading-state.component';

@Component({
  selector: 'app-roles-page',
  imports: [EmptyStateComponent, RolesTableComponent, ErrorStateComponent, LoadingStateComponent],
  templateUrl: './roles-page.component.html',
  styleUrl: './roles-page.component.scss',
})
export class RolesPageComponent implements OnInit {
  private readonly facade = inject(RolesFacade);
  public readonly roleState = this.facade.rolesState;
  public readonly roles = this.facade.roles;

  public ngOnInit(): void {
    this.facade.refresh();
  }
}
