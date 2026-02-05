import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should calculate totalPages correctly', () => {
    fixture.componentRef.setInput('total', 45);
    fixture.componentRef.setInput('pageSize', 10);
    fixture.detectChanges();

    expect(component.totalPages).toBe(5);
  });

  it('should render current page and total pages', () => {
    fixture.componentRef.setInput('pageNumber', 2);
    fixture.componentRef.setInput('total', 30);
    fixture.componentRef.setInput('pageSize', 10);
    fixture.detectChanges();

    const pageText = fixture.nativeElement.querySelector('span[aria-live="polite"]');

    expect(pageText).not.toBeNull();
    expect(pageText.textContent).toContain('Page 2 of 3');
  });

  it('should emit previous page', () => {
    const spy = vi.spyOn(component.pageChange, 'emit');

    fixture.componentRef.setInput('pageNumber', 3);
    fixture.componentRef.setInput('total', 50);
    fixture.componentRef.setInput('pageSize', 10);
    fixture.detectChanges();

    component.prevPage();

    expect(spy).toHaveBeenCalledWith(2);
  });

  it('should emit next page', () => {
    const spy = vi.spyOn(component.pageChange, 'emit');

    fixture.componentRef.setInput('pageNumber', 2);
    fixture.componentRef.setInput('total', 50);
    fixture.componentRef.setInput('pageSize', 10);
    fixture.detectChanges();

    component.nextPage();

    expect(spy).toHaveBeenCalledWith(3);
  });

  it('should emit first page', () => {
    const spy = vi.spyOn(component.pageChange, 'emit');

    fixture.componentRef.setInput('pageNumber', 4);
    fixture.componentRef.setInput('total', 50);
    fixture.componentRef.setInput('pageSize', 10);
    fixture.detectChanges();

    component.firstPage();

    expect(spy).toHaveBeenCalledWith(1);
  });

  it('should emit last page', () => {
    const spy = vi.spyOn(component.pageChange, 'emit');

    fixture.componentRef.setInput('pageNumber', 2);
    fixture.componentRef.setInput('total', 50);
    fixture.componentRef.setInput('pageSize', 10);
    fixture.detectChanges();

    component.lastPage();

    expect(spy).toHaveBeenCalledWith(5);
  });

  it('should not emit when disabled', () => {
    const spy = vi.spyOn(component.pageChange, 'emit');

    fixture.componentRef.setInput('pageNumber', 2);
    fixture.componentRef.setInput('total', 50);
    fixture.componentRef.setInput('pageSize', 10);
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    component.nextPage();
    component.prevPage();
    component.firstPage();
    component.lastPage();

    expect(spy).not.toHaveBeenCalled();
  });

  it('should disable navigation buttons at boundaries', () => {
    fixture.componentRef.setInput('pageNumber', 1);
    fixture.componentRef.setInput('total', 20);
    fixture.componentRef.setInput('pageSize', 10);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');

    expect(buttons[0].disabled).toBe(true); // First
    expect(buttons[1].disabled).toBe(true); // Prev
    expect(buttons[2].disabled).toBe(false); // Next
    expect(buttons[3].disabled).toBe(false); // Last
  });

  it('should have accessible pagination attributes', () => {
    fixture.detectChanges();

    const nav = fixture.nativeElement.querySelector('nav');
    expect(nav.getAttribute('aria-label')).toBe('pagination');
  });
});
