import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { authGuard } from './core/auth/auth.guard';

// App root level routes
export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: '',
    component: MainLayoutComponent,
    canMatch: [authGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadChildren: () =>
          import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
      },
      {
        path: 'users',
        loadChildren: () => import('./features/users/users.routes').then((m) => m.USERSROUTES),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
