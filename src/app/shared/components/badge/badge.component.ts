import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-badge',
  imports: [NgClass],
  templateUrl: './badge.component.html',
  styleUrl: './badge.component.scss',
})
export class BadgeComponent {
  @Input({ required: true }) public label!: string;
  @Input() public variant: 'success' | 'info' | 'warning' | 'neutral' | 'custom' = 'neutral';
  @Input() public customClass?: string = '';
}
