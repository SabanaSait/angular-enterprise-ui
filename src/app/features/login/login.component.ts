import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor(private readonly auth: AuthService, private router: Router) {}
  public login() {
    this.auth.login('ADMIN');
    this.router.navigateByUrl('/');
  }
}
