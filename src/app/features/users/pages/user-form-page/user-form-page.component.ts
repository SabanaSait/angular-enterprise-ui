import { Component, computed, effect, inject, Signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { UsersFacade } from '../../facade/users.facade';
import { UserStatus } from '../../models/user.model';
import { Role } from '../../../../core/auth/auth.types';

@Component({
  selector: 'app-user-form-page',
  imports: [ReactiveFormsModule],
  templateUrl: './user-form-page.component.html',
  styleUrl: './user-form-page.component.scss',
})
export class UserFormPageComponent {
  private readonly facade = inject(UsersFacade);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);

  private readonly userId = this.route.snapshot.paramMap.get('id');

  public readonly isEdit = computed(() => !!this.userId);

  public readonly user = toSignal(this.userId ? this.facade.getUser(this.userId) : of(null));

  public readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    role: ['', Validators.required],
    status: [UserStatus.Active, Validators.required],
  });

  constructor() {
    effect(() => {
      const user = this.user();
      if (user) {
        this.form.patchValue(user);
      }
    });
  }

  public submit(): void {
    if (this.form.invalid) return;

    const value = this.form.getRawValue();
    const dto = {
      name: value.name,
      email: value.email,
      role: value.role as Role,
      status: value.status,
    };

    if (this.userId) {
      this.facade.updateUser({ id: this.userId, ...dto });
    } else {
      this.facade.createUser(dto);
    }

    this.router.navigate(['/users']);
  }

  public cancel(): void {
    this.router.navigate(['/users']);
  }

  public isRequired(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!control?.hasValidator(Validators.required);
  }

  public isInvalidControl(controlName: string): boolean {
    const control = this.form.get(controlName);

    if (!control?.invalid) {
      return false;
    }

    return !!(control?.touched || control?.dirty);
  }
}
