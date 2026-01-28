import { AdminRole } from '../features/admin/models/role.model';

export const MOCK_ROLES: AdminRole[] = [
  {
    id: '1',
    code: 'ADMIN',
    name: 'Administrator',
    description: 'Full system access',
    permissions: ['VIEW_DASHBOARD', 'VIEW_USERS', 'MANAGE_USERS'],
    system: true,
  },
  {
    id: '2',
    code: 'SUPERVISOR',
    name: 'Supervisor',
    description: 'Can view users and dashboard',
    permissions: ['VIEW_DASHBOARD', 'VIEW_USERS'],
    system: true,
  },
  {
    id: '3',
    code: 'USER',
    name: 'User',
    description: 'Basic access',
    permissions: ['VIEW_DASHBOARD'],
    system: true,
  },
];
