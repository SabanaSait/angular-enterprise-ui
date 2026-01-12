import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor(
    private readonly auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  public login() {
    this.auth.login('ADMIN');

    const redirect = this.route.snapshot.queryParamMap.get('redirect') || '/';

    this.router.navigateByUrl(redirect);
  }
}
