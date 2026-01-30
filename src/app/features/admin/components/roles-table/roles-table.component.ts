import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AdminRole } from '../../models/role.model';

@Component({
  selector: 'app-roles-table',
  imports: [],
  templateUrl: './roles-table.component.html',
  styleUrl: './roles-table.component.scss',
})
export class RolesTableComponent {
  private readonly router = inject(Router);
  @Input() public roles: AdminRole[] = [];

  public viewRoleDetails(roleId: string): void {
    this.router.navigate(['admin', 'roles', roleId]);
  }
}
