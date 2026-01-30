import { TabItem } from '../../../shared/components/tabs/tabs.model';

export const ADMIN_TABS: TabItem[] = [
  {
    label: 'Roles',
    route: 'roles',
    requiredPermission: 'VIEW_ROLES',
  },
  {
    label: 'Permissions',
    route: 'permissions',
    requiredPermission: 'VIEW_PERMISSIONS',
  },
];
