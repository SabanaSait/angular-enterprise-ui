import { TabItem } from '../../../shared/components/tabs/tabs.model';

export const ADMIN_TABS: TabItem[] = [
  {
    label: $localize`:@@admin.tabs.roles:Roles`,
    route: 'roles',
    requiredPermission: 'VIEW_ROLES',
  },
  {
    label: $localize`:@@admin.tabs.permissions:Permissions`,
    route: 'permissions',
    requiredPermission: 'VIEW_PERMISSIONS',
  },
];
