import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { RolesFacade } from '../../facade/roles.facade';
import { toSignal } from '@angular/core/rxjs-interop';
import { Role } from '../../../../core/auth/auth.types';
import { BadgeComponent } from '../../../../shared/components/badge/badge.component';

@Component({
  selector: 'app-role-details',
  imports: [BadgeComponent],
  templateUrl: './role-details.component.html',
  styleUrl: './role-details.component.scss',
})
export class RoleDetailsComponent {
  private readonly facade = inject(RolesFacade);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly roleId = this.route.snapshot.paramMap.get('role') as Role;
  public readonly roleDetail = toSignal(this.roleId ? this.facade.getRole(this.roleId) : of(null));

  public cancel(): void {
    this.router.navigateByUrl('/admin/roles');
  }
}
