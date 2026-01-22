import { Component, computed } from '@angular/core';
import { ErrorService } from '../error/error.service';
import { NotificationService } from '../notification/notification.service';
import { ToastMessage } from './toast.types';
import { ToastComponent } from './toast.component';

@Component({
  selector: 'app-toast-container',
  imports: [ToastComponent],
  template: `
    <div class="toast-container">
      @for (toast of allMessages(); track toast.id) {
        <app-toast [message]="toast" (close)="remove(toast)"></app-toast>
      }
    </div>
  `,
})
export class ToastContainerComponent {
  constructor(
    private readonly errorService: ErrorService,
    private readonly notificationService: NotificationService,
  ) {}
  public allMessages = computed(() => [
    ...this.errorService.errors(),
    ...this.notificationService.messages(),
  ]);

  public remove(toast: ToastMessage) {
    toast.variant === 'error'
      ? this.errorService.removeError(toast.id)
      : this.notificationService.removeMessage(toast.id);
  }
}
