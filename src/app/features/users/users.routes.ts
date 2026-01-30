import { Routes } from '@angular/router';
import { UsersPageComponent } from './pages/user-page/users-page.component';
import { UserFormPageComponent } from './pages/user-form-page/user-form-page.component';
import { permissionGuard } from '../../core/auth/permission.guard';

// Feature level routes
export const USERS_ROUTES: Routes = [
  {
    path: '',
    component: UsersPageComponent,
  },
  {
    path: 'create',
    canMatch: [permissionGuard('MANAGE_USERS')],
    component: UserFormPageComponent,
  },
  {
    path: ':id/edit',
    canMatch: [permissionGuard('MANAGE_USERS')],
    component: UserFormPageComponent,
  },
];
