import { Injectable, signal } from '@angular/core';
import { ToastMessage, ToastMessageVariant } from '../toast/toast.types';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly _messages = signal<ToastMessage[]>([]);
  public readonly messages = this._messages.asReadonly();

  public success(message: string) {
    this.pushMessage(message, 'success');
  }
  public info(message: string) {
    this.pushMessage(message, 'info');
  }
  public warning(message: string) {
    this.pushMessage(message, 'warning');
  }

  public removeMessage(id: string) {
    this._messages.update((list) => list.filter((m) => m.id !== id));
  }

  private pushMessage(message: string, variant: ToastMessageVariant) {
    this._messages.update((list) => [
      ...list,
      {
        id: '1',
        message,
        variant,
        autoClose: true,
      },
    ]);
  }
}
