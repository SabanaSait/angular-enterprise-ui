import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss',
})
export class EmptyStateComponent {
  @Input() public heading = 'No data available';
  @Input() public description = '';
  @Input() public actionLabel = '';
  @Output() public action = new EventEmitter<void>();
}
