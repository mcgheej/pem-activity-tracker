import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ShellComponent } from '@pem-activity-tracker/shell';

@Component({
  standalone: true,
  imports: [RouterModule, ShellComponent],
  selector: 'pem-activity-tracker-root',
  template: `<pem-shell></pem-shell>`,
})
export class AppComponent {}
