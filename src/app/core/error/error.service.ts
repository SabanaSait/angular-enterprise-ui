import { Injectable, signal } from '@angular/core';
import { ToastMessage } from '../toast/toast.types';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  private readonly _errors = signal<ToastMessage[]>([]);
  readonly errors = this._errors.asReadonly();

  public pushError(error: unknown) {
    this._errors.update((list) => [
      ...list,
      {
        id: crypto.randomUUID(),
        message: this.normalizeError(error),
        variant: 'error',
        autoClose: false,
      },
    ]);
  }

  public removeError(id: string) {
    this._errors.update((list) => list.filter((e) => e.id !== id));
  }

  private normalizeError(error: unknown): string {
    if (typeof error === 'object' && error !== null && 'message' in error) {
      return String((error as any).message);
    }
    if (typeof error === 'string') return error;
    if (error instanceof Error) return error.message;
    return 'something went wrong. Please try again.';
  }
}
