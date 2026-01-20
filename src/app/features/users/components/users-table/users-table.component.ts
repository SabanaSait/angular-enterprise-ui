import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { PaginationComponent } from '../../../../shared/pagination/pagination.component';
import { EmptyStateComponent } from '../../../../shared/empty-state/empty-state.component';
import { User, UserStatus } from '../../models/user.model';
import { SortDirection, UserSortKey } from '../../models/users-query.model';

@Component({
  selector: 'app-users-table',
  imports: [PaginationComponent, EmptyStateComponent, TitleCasePipe],
  templateUrl: './users-table.component.html',
  styleUrl: './users-table.component.scss',
})
export class UsersTableComponent {
  @Input() public users: User[] = [];
  @Input() public total = 0;
  @Input() pageNumber = 1;
  @Input() pageSize = 10;
  @Input() loading = false;
  @Input() sortDirection!: SortDirection;
  @Input() sortBy!: UserSortKey;

  @Output() public pageChange = new EventEmitter<number>();
  @Output() public createUser = new EventEmitter<void>();
  @Output() public sortChange = new EventEmitter<{ by: keyof User; direction: SortDirection }>();

  public toggleSort(column: keyof User) {
    const isSameColumn = this.sortBy === column;
    const direction = isSameColumn && this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.sortChange.emit({ by: column, direction });
  }
  public isActiveUser(user: User): boolean {
    return user.status === UserStatus.Active;
  }
}
