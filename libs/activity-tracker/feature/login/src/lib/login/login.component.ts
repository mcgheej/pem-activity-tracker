import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AfAuthenticationService } from '@pem-activity-tracker/af-authentication';

interface UserDetails {
  email: string | null;
  password: string | null;
}

@Component({
  selector: 'pem-login',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private fb: FormBuilder = inject(FormBuilder);
  private router: Router = inject(Router);
  private snackBar: MatSnackBar = inject(MatSnackBar);
  private afAuth: AfAuthenticationService = inject(AfAuthenticationService);

  loginForm = this.fb.group({
    email: [
      '',
      {
        validators: [Validators.required, Validators.email],
      },
    ],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  getEmailError(): string {
    if (this.loginForm.controls.email.hasError('required')) {
      return 'You must enter an email address';
    }
    return this.loginForm.controls.email.hasError('email')
      ? 'Not a valid email'
      : '';
  }

  getPasswordError(): string {
    if (this.loginForm.controls.password.hasError('required')) {
      return 'You must enter a password';
    }
    return this.loginForm.controls.password.hasError('minlength')
      ? 'Password must be at least 8 characters'
      : '';
  }

  onSubmit(value: Partial<UserDetails>, formDirective: FormGroupDirective) {
    const email = value.email ?? '';
    const password = value.password ?? '';

    this.afAuth.login(email, password).subscribe({
      next: () => this.router.navigateByUrl('/activities'),
      error: () => {
        formDirective.resetForm();
        this.loginForm.reset();
        this.snackBar.open('Invalid username/password', undefined, {
          duration: 2000,
        });
      },
    });
  }

  onForgotPassword() {
    this.snackBar.open('Forgot password not implemented', undefined, {
      duration: 2000,
    });
  }
}
