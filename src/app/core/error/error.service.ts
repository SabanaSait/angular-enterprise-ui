import { Injectable, signal } from '@angular/core';
import { ToastMessage } from '../toast/toast.types';
import { ApiError } from '../api/api.model';
import { HTTP_ERROR_MESSAGES } from './error.constants';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  private readonly _errors = signal<ToastMessage[]>([]);
  readonly errors = this._errors.asReadonly();

  public pushError(error: ApiError) {
    const errorMessage = HTTP_ERROR_MESSAGES[error.status] || HTTP_ERROR_MESSAGES[500];
    this._errors.update((list) => [
      ...list,
      {
        id: crypto.randomUUID(),
        message: errorMessage.title,
        variant: 'error',
        autoClose: false,
      },
    ]);
  }

  public removeError(id: string) {
    this._errors.update((list) => list.filter((e) => e.id !== id));
  }
}
