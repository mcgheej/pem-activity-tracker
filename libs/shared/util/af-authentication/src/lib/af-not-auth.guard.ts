import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AfAuthenticationService } from './af-authentication.service';

export function afNotAuthGuard(redirectUrl: string): CanActivateFn {
  return () => {
    const router = inject(Router);
    const auth = inject(AfAuthenticationService);
    return auth.isLoggedIn$.pipe(
      map((loggedIn) => {
        if (loggedIn) {
          return router.parseUrl(redirectUrl);
        }
        return true;
      })
    );
  };
}
