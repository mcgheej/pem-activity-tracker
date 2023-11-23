import { Route } from '@angular/router';
import {
  afAuthGuard,
  afNotAuthGuard,
} from '@pem-activity-tracker/af-authentication';
import { HomeComponent } from '@pem-activity-tracker/home';
import { PageNotFoundComponent } from '@pem-activity-tracker/shell';

export const appRoutes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: '/home' },
  { path: 'home', component: HomeComponent, title: 'Home Page' },
  {
    path: 'activities',
    canActivate: [afAuthGuard('/home')],
    loadChildren: () =>
      import('@pem-activity-tracker/activities').then(
        (m) => m.activitiesRoutes
      ),
  },
  {
    path: 'login',
    canActivate: [afNotAuthGuard('/home')],
    loadChildren: () =>
      import('@pem-activity-tracker/login').then((m) => m.loginRoutes),
  },
  { path: '**', component: PageNotFoundComponent },
];
