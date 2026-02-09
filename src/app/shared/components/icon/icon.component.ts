import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';
import { ICON_PATHS, IconName } from './icon-paths';

@Component({
  selector: 'app-icon',
  imports: [NgClass],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
})
export class IconComponent {
  @Input({ required: true }) public name!: IconName;
  @Input() public size = 16;
  @Input() public className = '';
  @Input() public ariaLabel?: string;

  public get path(): string | null {
    return ICON_PATHS[this.name] ?? null;
  }
}
