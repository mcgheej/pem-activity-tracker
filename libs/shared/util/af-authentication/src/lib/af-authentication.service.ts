import { Injectable, inject } from '@angular/core';
import {
  Auth,
  UserCredential,
  authState,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable, from, map } from 'rxjs';

@Injectable()
export class AfAuthenticationService {
  private router: Router = inject(Router);
  private afAuth: Auth = inject(Auth);

  private authState$ = authState(this.afAuth);

  isLoggedIn$: Observable<boolean>;

  constructor() {
    this.isLoggedIn$ = this.authState$.pipe(map((user) => !!user));
  }

  login(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.afAuth, email, password));
  }

  logout(): Observable<void> {
    return from(this.afAuth.signOut());
  }
}
