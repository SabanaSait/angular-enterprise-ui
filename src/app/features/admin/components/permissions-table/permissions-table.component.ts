import { Component, Input } from '@angular/core';
import { PermissionLabelPipe } from '../../../../shared/pipes/permission-label.pipe';
import { AdminPermission } from '../../models/permission.model';

@Component({
  selector: 'app-permissions-table',
  imports: [PermissionLabelPipe],
  templateUrl: './permissions-table.component.html',
  styleUrl: './permissions-table.component.scss',
})
export class PermissionsTableComponent {
  @Input({ required: true }) public permissions!: AdminPermission[];
}
