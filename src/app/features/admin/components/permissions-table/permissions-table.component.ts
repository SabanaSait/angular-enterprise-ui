import { Component, Input } from '@angular/core';
import { AdminPermission } from '../../models/permission.model';

@Component({
  selector: 'app-permissions-table',
  imports: [],
  templateUrl: './permissions-table.component.html',
  styleUrl: './permissions-table.component.scss',
})
export class PermissionsTableComponent {
  @Input({ required: true }) public permissions!: AdminPermission[];
}
