import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastMessage } from './toast.types';

@Component({
  selector: 'app-toast',
  template: `
    <div class="toast" [class]="message.variant" role="status">
      <span>{{ message.message }}</span>
      <button type="button" aria-label="Dismiss notification" title="Close" (click)="close.emit()">
        X
      </button>
    </div>
  `,
})
export class ToastComponent implements OnInit {
  @Input({ required: true }) public message!: ToastMessage;
  @Output() public close = new EventEmitter<void>();

  public ngOnInit(): void {
    if (this.message.autoClose) {
      setTimeout(() => {
        this.close.emit();
      }, 4000);
    }
  }
}
