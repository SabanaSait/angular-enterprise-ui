import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';

@Component({
  selector: 'app-unauthorized',
  imports: [ErrorStateComponent],
  templateUrl: './unauthorized.component.html',
  styleUrl: './unauthorized.component.scss',
})
export class UnauthorizedComponent {
  private readonly router = inject(Router);
  public goBack(): void {
    this.router.navigateByUrl('/');
  }
}
