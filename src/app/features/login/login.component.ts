import { Component, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { Role } from '../../core/auth/auth.types';
import { ROLE_OPTIONS } from '../../core/auth/auth.constants';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  private readonly fb = inject(FormBuilder);
  public readonly roleOptions = ROLE_OPTIONS;

  public readonly loginForm = this.fb.nonNullable.group({
    userRole: ['USER', Validators.required],
  });

  public login() {
    const userRoleSelected = this.loginForm.value.userRole as Role;
    console.log(userRoleSelected, 'userRoleSelected');
    this.auth.login(userRoleSelected);

    const redirect = this.route.snapshot.queryParamMap.get('redirect') || '/dashboard';

    this.router.navigateByUrl(redirect);
  }
}
