import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavProps } from '../../shell.types';

@Component({
  selector: 'pem-navbar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './navbar.component.html',
  styles: [
    `
      .active-link {
        @apply underline decoration-2 underline-offset-8 decoration-indigo-500;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent {
  @Input() navProps: NavProps[] = [];
  @Input() loggedIn = false;
  @Output() toggleSidenav = new EventEmitter<void>();
  @Output() logoutClick = new EventEmitter<void>();

  onSidenavToggleClick(button: MatIconButton) {
    button._elementRef.nativeElement.blur();
    this.toggleSidenav.emit();
  }
}
