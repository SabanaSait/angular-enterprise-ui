import { Routes } from '@angular/router';
import { MainLayout } from './layout/main-layout/main-layout';

export const routes: Routes = [
    {
        path: '',
        component: MainLayout,
        children: [
            {
                path: '',
                pathMatch: 'full',
                loadComponent: () => 
                    import('./features/dashboard/dashboard')
                        .then(m => m.Dashboard)

            },
            {
                path: 'users',
                loadComponent: () => import('./features/users/users')
                    .then(m => m.Users)
            }
        ]
    }
];
