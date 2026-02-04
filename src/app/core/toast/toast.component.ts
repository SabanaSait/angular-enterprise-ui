import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastMessage } from './toast.types';

@Component({
  selector: 'app-toast',
  template: `
    <div class="toast" [class]="message.variant" role="status">
      <span>{{ message.message }}</span>
      <button
        type="button"
        aria-label="Dismiss notification"
        title="Close"
        (click)="toastClose.emit()"
      >
        X
      </button>
    </div>
  `,
})
export class ToastComponent implements OnInit {
  @Input({ required: true }) public message!: ToastMessage;
  @Output() public toastClose = new EventEmitter<void>();

  public ngOnInit(): void {
    if (this.message.autoClose) {
      setTimeout(() => {
        this.toastClose.emit();
      }, 4000);
    }
  }
}
