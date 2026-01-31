import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { AdminRole } from '../../models/role.model';
import { BadgeComponent } from '../../../../shared/components/badge/badge.component';

@Component({
  selector: 'app-roles-table',
  imports: [BadgeComponent],
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
