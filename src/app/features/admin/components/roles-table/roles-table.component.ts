import { Component, Input } from '@angular/core';
import { AdminRole } from '../../models/role.model';

@Component({
  selector: 'app-roles-table',
  imports: [],
  templateUrl: './roles-table.component.html',
  styleUrl: './roles-table.component.scss',
})
export class RolesTableComponent {
  @Input() public roles: AdminRole[] = [];
}
