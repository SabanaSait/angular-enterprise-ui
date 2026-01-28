import { Component, inject } from '@angular/core';
import { RolesFacade } from '../../facade/roles.facade';
import { RolesTableComponent } from '../../components/roles-table/roles-table.component';

@Component({
  selector: 'app-roles-page',
  imports: [RolesTableComponent],
  templateUrl: './roles-page.component.html',
  styleUrl: './roles-page.component.scss',
})
export class RolesPageComponent {
  private readonly facade = inject(RolesFacade);
  public readonly roleState = this.facade.rolesState;
  public readonly roles = this.facade.roles;
}
