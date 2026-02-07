import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { vi } from 'vitest';

import { RolesFacade } from './roles.facade';
import { RolesApi } from '../services/roles.api';
import { AdminRole } from '../models/role.model';

describe('RolesFacade', () => {
  let facade: RolesFacade;
  let rolesApiMock: {
    getRoles: ReturnType<typeof vi.fn>;
    getRole: ReturnType<typeof vi.fn>;
  };

  const role: AdminRole = {
    id: 'role-1',
    code: 'ADMIN',
    name: 'Admin',
    description: 'Admin role',
    permissions: ['VIEW_ADMIN'],
    system: true,
  };

  const waitForSignal = () => new Promise((resolve) => setTimeout(resolve, 10));

  beforeEach(() => {
    rolesApiMock = {
      getRoles: vi.fn(),
      getRole: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [RolesFacade, { provide: RolesApi, useValue: rolesApiMock }],
    });

    facade = TestBed.inject(RolesFacade);
  });

  it('should be created', () => {
    expect(facade).toBeTruthy();
  });

  it('should start in loading state', () => {
    const rolesSubject = new Subject<AdminRole[]>();
    rolesApiMock.getRoles.mockReturnValue(rolesSubject.asObservable());

    const rolesState = TestBed.runInInjectionContext(() => facade.rolesState);
    const state = rolesState();
    expect(state.status).toBe('loading');
  });

  it('should emit success state when roles load', async () => {
    const rolesSubject = new Subject<AdminRole[]>();
    rolesApiMock.getRoles.mockReturnValue(rolesSubject.asObservable());

    const rolesState = TestBed.runInInjectionContext(() => facade.rolesState);
    expect(rolesState().status).toBe('loading');

    await waitForSignal();
    rolesSubject.next([role]);
    await waitForSignal();

    expect(rolesState().status).toBe('success');
    expect(rolesState().data).toEqual([role]);
  });

  it('should emit error state when api fails', async () => {
    const rolesSubject = new Subject<AdminRole[]>();
    rolesApiMock.getRoles.mockReturnValue(rolesSubject.asObservable());

    const rolesState = TestBed.runInInjectionContext(() => facade.rolesState);
    expect(rolesState().status).toBe('loading');

    rolesSubject.error(new Error('API failed'));
    await waitForSignal();

    expect(rolesState().status).toBe('error');
    expect(rolesState().error).toBeTruthy();
  });

  it('should expose roles from the data state', async () => {
    const rolesSubject = new Subject<AdminRole[]>();
    rolesApiMock.getRoles.mockReturnValue(rolesSubject.asObservable());

    const rolesState = TestBed.runInInjectionContext(() => facade.rolesState);
    TestBed.runInInjectionContext(() => facade.roles());

    await waitForSignal();
    rolesSubject.next([role]);
    await waitForSignal();

    expect(rolesState().status).toBe('success');
    expect(TestBed.runInInjectionContext(() => facade.roles())).toEqual([role]);
  });

  it('should refetch roles when refresh is called', async () => {
    const firstSubject = new Subject<AdminRole[]>();
    const secondSubject = new Subject<AdminRole[]>();
    rolesApiMock.getRoles
      .mockReturnValueOnce(firstSubject.asObservable())
      .mockReturnValueOnce(secondSubject.asObservable());

    const rolesState = TestBed.runInInjectionContext(() => facade.rolesState);
    rolesState();
    await waitForSignal();

    expect(rolesApiMock.getRoles).toHaveBeenCalledTimes(1);

    facade.refresh();
    await waitForSignal();

    expect(rolesApiMock.getRoles).toHaveBeenCalledTimes(2);
  });

  it('should forward getRole calls to the api', () => {
    const apiResult$ = new Subject<AdminRole>().asObservable();
    rolesApiMock.getRole.mockReturnValue(apiResult$);

    const result$ = facade.getRole('role-1');

    expect(result$).toBe(apiResult$);
    expect(rolesApiMock.getRole).toHaveBeenCalledWith('role-1');
  });
});
