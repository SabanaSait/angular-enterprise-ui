import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { AdminIndexComponent } from './admin-index.component';
import { AuthService } from '../../../../core/auth/auth.service';
import { TabsComponent } from '../../../../shared/components/tabs/tabs.component';
import { TabItem } from '../../../../shared/components/tabs/tabs.model';

@Component({
  selector: 'app-tabs',
  standalone: true,
  template: '',
})
class TabsStubComponent {
  @Input() tabs: TabItem[] = [];
}

describe('AdminIndexComponent', () => {
  let component: AdminIndexComponent;
  let fixture: ComponentFixture<AdminIndexComponent>;
  let authServiceMock: { hasAccess: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    authServiceMock = {
      hasAccess: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [AdminIndexComponent, TabsStubComponent],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    })
      .overrideComponent(AdminIndexComponent, {
        remove: { imports: [TabsComponent] },
        add: { imports: [TabsStubComponent] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(AdminIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should include all tabs when permissions are granted', () => {
    authServiceMock.hasAccess.mockReturnValue(true);

    fixture = TestBed.createComponent(AdminIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.tabs.length).toBe(2);
  });

  it('should filter tabs based on permissions', () => {
    authServiceMock.hasAccess.mockImplementation(
      (permission: string) => permission === 'VIEW_ROLES',
    );

    fixture = TestBed.createComponent(AdminIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.tabs.length).toBe(1);
    expect(component.tabs[0].route).toBe('roles');
  });

  it('should pass filtered tabs to tabs component', () => {
    authServiceMock.hasAccess.mockReturnValue(true);

    fixture = TestBed.createComponent(AdminIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const tabs = fixture.debugElement.query(
      (el) => el.componentInstance instanceof TabsStubComponent,
    );
    expect(tabs.componentInstance.tabs).toEqual(component.tabs);
  });
});
