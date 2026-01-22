import { Routes } from '@angular/router';
import { UsersPageComponent } from './pages/user-page/users-page.component';
import { UserFormPageComponent } from './pages/user-form-page/user-form-page.component';

// Feature level routes
export const USERS_ROUTES: Routes = [
  {
    path: '',
    component: UsersPageComponent,
  },
  {
    path: 'create',
    component: UserFormPageComponent,
  },
  {
    path: ':id/edit',
    component: UserFormPageComponent,
  },
];
