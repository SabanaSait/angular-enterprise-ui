import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, RouterLink } from '@angular/router';

import { TabsComponent } from './tabs.component';

describe('TabsComponent', () => {
  let component: TabsComponent;
  let fixture: ComponentFixture<TabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(TabsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.componentRef.setInput('tabs', []);
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should render a tab for each tab item', () => {
    fixture.componentRef.setInput('tabs', [
      { label: 'Users', route: '/users' },
      { label: 'Roles', route: '/roles' },
    ]);

    fixture.detectChanges();

    const links = fixture.nativeElement.querySelectorAll('a.tab');
    expect(links.length).toBe(2);
  });

  it('should render tab labels', () => {
    fixture.componentRef.setInput('tabs', [{ label: 'Users', route: '/users' }]);

    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('a.tab');
    expect(link.textContent).toContain('Users');
  });

  it('should bind routerLink to tab route', () => {
    fixture.componentRef.setInput('tabs', [{ label: 'Users', route: '/users' }]);

    fixture.detectChanges();

    const linkDebugEl = fixture.debugElement.query(By.directive(RouterLink));
    const routerLink = linkDebugEl.injector.get(RouterLink);

    expect(routerLink.urlTree).toBeTruthy();
    expect(routerLink.urlTree!.toString()).toBe('/users');
  });
});
