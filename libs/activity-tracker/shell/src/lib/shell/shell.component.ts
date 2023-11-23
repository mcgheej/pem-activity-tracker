import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, RouterModule } from '@angular/router';
import { AfAuthenticationService } from '@pem-activity-tracker/af-authentication';
import { AfClientDataService } from '@pem-activity-tracker/af-client-data';
import { map } from 'rxjs';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { navProps } from './nav-props';

@Component({
  selector: 'pem-shell',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    NavbarComponent,
  ],
  templateUrl: './shell.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShellComponent {
  router = inject(Router);
  afClientsData = inject(AfClientDataService);

  private afAuth = inject(AfAuthenticationService);

  menuHidden = true;
  vm$ = this.afAuth.isLoggedIn$.pipe(
    map((loggedIn) => {
      return {
        loggedIn,
      };
    })
  );

  navProps = navProps;

  onHomeClick() {
    this.router.navigateByUrl('/home');
  }

  onLogout(sidenav: MatSidenav) {
    sidenav.close();
    this.afAuth.logout().subscribe(() => this.router.navigateByUrl('/home'));
  }
}
