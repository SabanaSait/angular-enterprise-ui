import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.component.html',
  styleUrl: './empty-state.component.scss',
})
export class EmptyStateComponent {
  @Input() public title = 'No data available';
  @Input() public description = '';
  @Input() public actionLabel = '';
  @Input() public action?: () => void;
}
