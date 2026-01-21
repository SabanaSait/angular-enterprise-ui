import { Component, Input } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { UserStatus } from '../../../features/users/models/user.model';

@Component({
  selector: 'app-status-pill',
  imports: [TitleCasePipe],
  templateUrl: './status-pill.component.html',
  styleUrl: './status-pill.component.scss',
})
export class StatusPillComponent {
  @Input({ required: true }) public status!: string;

  public isActiveUser(status: string): boolean {
    return status === UserStatus.Active;
  }
}
