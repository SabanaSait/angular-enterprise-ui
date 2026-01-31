import { Pipe, PipeTransform } from '@angular/core';
import { Role } from '../../core/auth/auth.types';
import { ROLE_OPTIONS } from '../../core/auth/auth.constants';

@Pipe({
  name: 'roleLabel',
  standalone: true,
})
export class RoleLabelPipe implements PipeTransform {
  transform(role: Role | null | undefined): string {
    return ROLE_OPTIONS.find((r) => r.value === role)?.label ?? role ?? '-';
  }
}
