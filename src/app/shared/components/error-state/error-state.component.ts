import { Component, computed, EventEmitter, Input, Output } from '@angular/core';
import { HTTP_ERROR_MESSAGES } from '../../../core/error/error.constants';

@Component({
  selector: 'app-error-state',
  imports: [],
  templateUrl: './error-state.component.html',
  styleUrl: './error-state.component.scss',
})
export class ErrorStateComponent {
  @Input() public errorTitle!: string;
  @Input() public errorDescription?: string;
  @Input() public statusCode?: number;
  @Input() public actionLabel?: string;
  @Output() public action = new EventEmitter<void>();

  public readonly resolvedError = computed(() => {
    if (this.errorTitle || this.errorDescription) {
      return {
        title: this.errorTitle ?? 'Something went wrong',
        description: this.errorDescription ?? '',
        actionLabel: this.actionLabel,
      };
    }

    if (this.statusCode && HTTP_ERROR_MESSAGES[this.statusCode]) {
      return HTTP_ERROR_MESSAGES[this.statusCode];
    }

    return {
      title: 'Something went wrong',
      description: 'An unexpected error occurred. Please try again later.',
    };
  });
}
