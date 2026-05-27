import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/auth/auth.service';
import { ToastContainerComponent } from './core/toast/toast-container.component';
import { CopilotHostComponent } from './shared/components/copilot/copilot-host.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastContainerComponent, CopilotHostComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  public isCopilotEnabled = false;
  private authService = inject(AuthService);

  ngOnInit() {
    this.isCopilotEnabled = this.authService.hasFeature('COPILOT');
  }
}
