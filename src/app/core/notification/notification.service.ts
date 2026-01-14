import { Injectable, signal } from '@angular/core';
import { ToastMessage, ToastMessageVariant } from '../toast/toast.types';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly _messages = signal<ToastMessage[]>([]);
  public readonly messages = this._messages.asReadonly();

  public success(message: string) {
    this.show(message, 'success');
  }
  public info(message: string) {
    this.show(message, 'info');
  }
  public warning(message: string) {
    this.show(message, 'warning');
  }

  public removeMessage(id: string) {
    this._messages.update((list) => list.filter((m) => m.id !== id));
  }

  public show(message: string, variant: ToastMessageVariant = 'info') {
    this.pushMessage(message, variant);
  }

  private pushMessage(message: string, variant: ToastMessageVariant) {
    this._messages.update((list) => [
      ...list,
      {
        id: crypto.randomUUID(),
        message,
        variant,
        autoClose: true,
      },
    ]);
  }
}
