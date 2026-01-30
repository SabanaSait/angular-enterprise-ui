import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state.component';
import { User, UserStatus } from '../../models/user.model';
import { SortDirection, UserSortKey } from '../../models/users-query.model';
import { StatusPillComponent } from '../../../../shared/components/status-pill.component/status-pill.component';

@Component({
  selector: 'app-users-table',
  imports: [PaginationComponent, EmptyStateComponent, StatusPillComponent],
  templateUrl: './users-table.component.html',
  styleUrl: './users-table.component.scss',
})
export class UsersTableComponent {
  @Input() public users: User[] = [];
  @Input() public total = 0;
  @Input() public pageNumber = 1;
  @Input() public pageSize = 10;
  @Input() public loading = false;
  @Input() public sortDirection!: SortDirection;
  @Input() public sortBy!: UserSortKey;
  @Input() public canManageUsers: boolean = false;

  @Output() public pageChange = new EventEmitter<number>();
  @Output() public sortChange = new EventEmitter<{ by: keyof User; direction: SortDirection }>();
  @Output() public addUser = new EventEmitter<void>();
  @Output() public editUser = new EventEmitter<User>();
  @Output() public deleteUser = new EventEmitter<User>();

  public toggleSort(column: keyof User) {
    const isSameColumn = this.sortBy === column;
    const direction = isSameColumn && this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.sortChange.emit({ by: column, direction });
  }
}
