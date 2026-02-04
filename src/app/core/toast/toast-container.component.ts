import { Component, computed, inject } from '@angular/core';
import { ErrorService } from '../error/error.service';
import { NotificationService } from '../notification/notification.service';
import { ToastMessage } from './toast.types';
import { ToastComponent } from './toast.component';

@Component({
  selector: 'app-toast-container',
  imports: [ToastComponent],
  template: `
    <div class="toast-container" aria-live="polite" aria-atomic="false">
      @for (toast of allMessages(); track toast.id) {
        <app-toast [message]="toast" (toastClose)="remove(toast)"></app-toast>
      }
    </div>
  `,
})
export class ToastContainerComponent {
  private readonly errorService = inject(ErrorService);
  private readonly notificationService = inject(NotificationService);

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
