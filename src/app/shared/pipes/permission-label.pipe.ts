import { Pipe, PipeTransform } from '@angular/core';
import { PERMISSIONS_META } from '../../core/auth/auth.constants';
import { Permission } from '../../core/auth/auth.types';
@Pipe({
  name: 'permissionLabel',
  standalone: true,
})
export class PermissionLabelPipe implements PipeTransform {
  transform(permission: Permission): string {
    return PERMISSIONS_META[permission]?.label ?? permission;
  }
}
