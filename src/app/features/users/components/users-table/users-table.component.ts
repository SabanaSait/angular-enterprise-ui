import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaginationComponent } from '../../../../shared/pagination/pagination.component';
import { EmptyStateComponent } from '../../../../shared/empty-state/empty-state.component';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-users-table',
  imports: [PaginationComponent, EmptyStateComponent],
  templateUrl: './users-table.component.html',
  styleUrl: './users-table.component.scss',
})
export class UsersTableComponent {
  @Input() public users: User[] = [];
  @Input() public total = 0;
  @Input() pageNumber = 1;
  @Input() pageSize = 10;
  @Input() loading = false;

  @Output() public pageChange = new EventEmitter<number>();
  @Output() public createUser = new EventEmitter<void>();
}
