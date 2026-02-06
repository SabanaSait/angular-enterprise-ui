import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SidenavComponent } from './sidenav.component';
import { AuthService } from '../../core/auth/auth.service';
import { NAV_ITEMS } from '../navigation.config';

@Component({ template: '' })
class DummyComponent {}

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;
  let authMock: { hasAccess: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    authMock = {
      hasAccess: vi.fn().mockReturnValue(true),
    };

    await TestBed.configureTestingModule({
      imports: [SidenavComponent],
      providers: [
        provideRouter([
          { path: 'users', component: DummyComponent },
          { path: 'roles', component: DummyComponent },
        ]),
        { provide: AuthService, useValue: authMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render navigation links based on NAV_ITEMS and access', () => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    const links = fixture.nativeElement.querySelectorAll('a');
    expect(links.length).toBe(NAV_ITEMS.length);
  });

  it('should not render links when access is denied', () => {
    authMock.hasAccess.mockReturnValue(false);

    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    const links = fixture.nativeElement.querySelectorAll('a');
    expect(links.length).toBe(0);
  });

  it('should add open class when open is true', () => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    const aside = fixture.nativeElement.querySelector('aside');
    expect(aside.classList.contains('open')).toBe(true);
  });

  it('should render backdrop when open', () => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    const backdrop = fixture.nativeElement.querySelector('.sidebar-backdrop');
    expect(backdrop).not.toBeNull();
  });

  it('should emit sidenavClose when backdrop is clicked', () => {
    const emitSpy = vi.spyOn(component.sidenavClose, 'emit');

    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    const backdrop = fixture.nativeElement.querySelector('.sidebar-backdrop') as HTMLElement;
    backdrop.click();

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should emit sidenavClose on Escape key when open', () => {
    const emitSpy = vi.spyOn(component.sidenavClose, 'emit');

    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(emitSpy).toHaveBeenCalled();
  });

  it('should not emit sidenavClose on Escape when closed', () => {
    const emitSpy = vi.spyOn(component.sidenavClose, 'emit');

    fixture.componentRef.setInput('open', false);
    fixture.detectChanges();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(emitSpy).not.toHaveBeenCalled();
  });

  it('should focus first link when sidebar opens', async () => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    // wait for setTimeout in ngOnChanges
    await new Promise((resolve) => setTimeout(resolve));

    const firstLink = fixture.nativeElement.querySelector('a') as HTMLElement;
    expect(document.activeElement).toBe(firstLink);
  });

  it('should trap focus within sidebar when tabbing', async () => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();

    await new Promise((resolve) => setTimeout(resolve));

    const links = fixture.nativeElement.querySelectorAll('a') as NodeListOf<HTMLElement>;
    const first = links[0];
    const last = links[links.length - 1];

    last.focus();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab' }));

    expect(document.activeElement).toBe(first);
  });
});
