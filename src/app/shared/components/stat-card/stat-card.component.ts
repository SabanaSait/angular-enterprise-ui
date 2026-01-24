import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-card',
  imports: [],
  templateUrl: './stat-card.component.html',
  styleUrl: './stat-card.component.scss',
})
export class StatCardComponent {
  @Input({ required: true }) public label!: string;
  @Input({ required: true }) public value!: number | string;
}
