import { AdminPermission } from '../features/admin/models/permission.model';

export const MOCK_PERMISSIONS: AdminPermission[] = [
  {
    id: crypto.randomUUID(),
    code: 'VIEW_DASHBOARD',
    label: 'Allows to view the app dashboard',
  },
  {
    id: crypto.randomUUID(),
    code: 'VIEW_USERS',
    label: 'Allows to view the dashboard and users',
  },
  {
    id: crypto.randomUUID(),
    code: 'MANAGE_USERS',
    label: 'Allows to view the dashboard, manage users and access the roles and permissions.',
  },
];
