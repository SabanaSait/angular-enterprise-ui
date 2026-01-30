import { Permission } from '../../../core/auth/auth.types';

export interface TabItem {
  label: string;
  route: string;
  icon?: string;
  disabled?: boolean;
  requiredPermission?: Permission;
}
