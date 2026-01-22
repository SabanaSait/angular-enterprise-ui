// This page currently owns users state and API orchestration.
// As the feature grows (filters, sorting, actions),
// this logic can be extracted into a UsersFacade.
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent {
  @Input() public pageNumber = 1;
  @Input() public pageSize = 10;
  @Input() public total = 0;
  @Input() public disabled = false;

  @Output() public pageChange = new EventEmitter<number>();

  public get totalPages(): number {
    return Math.ceil(this.total / this.pageSize);
  }

  public prevPage(): void {
    if (this.pageNumber > 1 && !this.disabled) {
      this.pageChange.emit(this.pageNumber - 1);
    }
  }
  public nextPage(): void {
    if (this.pageNumber < this.totalPages && !this.disabled) {
      this.pageChange.emit(this.pageNumber + 1);
    }
  }

  public firstPage(): void {
    if (this.pageNumber > 1 && !this.disabled) {
      this.pageChange.emit(1);
    }
  }

  public lastPage(): void {
    if (this.pageNumber < this.totalPages && !this.disabled) {
      this.pageChange.emit(this.totalPages);
    }
  }
}
