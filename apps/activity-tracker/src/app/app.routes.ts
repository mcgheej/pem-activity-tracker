import { Route } from '@angular/router';
import { HomeComponent } from '@pem-activity-tracker/home';
import { PageNotFoundComponent } from '@pem-activity-tracker/shell';

export const appRoutes: Route[] = [
  { path: '', pathMatch: 'full', redirectTo: '/home' },
  { path: 'home', component: HomeComponent, title: 'Home Page' },
  { path: '**', component: PageNotFoundComponent },
];
