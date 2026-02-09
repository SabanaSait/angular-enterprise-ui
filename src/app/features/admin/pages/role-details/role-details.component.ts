import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { RolesFacade } from '../../facade/roles.facade';
import { toSignal } from '@angular/core/rxjs-interop';
import { Permission, Role } from '../../../../core/auth/auth.types';
import { ROLE_PERMISSION_GROUPS, PermissionGroup } from './role-permission-groups';
import { BadgeComponent } from '../../../../shared/components/badge/badge.component';
import { PermissionLabelPipe } from '../../../../shared/pipes/permission-label.pipe';
import { IconComponent } from '../../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-role-details',
  imports: [BadgeComponent, PermissionLabelPipe, IconComponent],
  templateUrl: './role-details.component.html',
  styleUrl: './role-details.component.scss',
})
export class RoleDetailsComponent {
  private readonly facade = inject(RolesFacade);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly roleId = this.route.snapshot.paramMap.get('role') as Role;
  public readonly roleDetail = toSignal(this.roleId ? this.facade.getRole(this.roleId) : of(null));
  public readonly permissionGroups = ROLE_PERMISSION_GROUPS;

  public getPermissionsForGroup(
    group: PermissionGroup,
    rolePermissions: Permission[],
  ): Permission[] {
    return group.permissions.filter((p) => rolePermissions.includes(p));
  }

  public cancel(): void {
    this.router.navigateByUrl('/admin/roles');
  }
}
