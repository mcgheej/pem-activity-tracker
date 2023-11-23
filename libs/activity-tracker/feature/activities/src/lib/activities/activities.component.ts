import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Client, Project } from '@pem-activity-tracker/activity-tracker-types';
import { AfClientDataService } from '@pem-activity-tracker/af-client-data';
import { combineLatest, map } from 'rxjs';
import { PemSelectListComponent } from '../components/pem-select-list/pem-select-list.component';

@Component({
  selector: 'pem-activities',
  standalone: true,
  imports: [CommonModule, PemSelectListComponent],
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivitiesComponent {
  db = inject(AfClientDataService);

  vm$ = combineLatest([
    this.db.clients$,
    this.db.selectedClient$,
    this.db.selectedProject$,
  ]).pipe(
    map(([clients, selectedClient, selectedProject]) => {
      // console.log(clients);
      // console.log(selectedClient);
      // console.log(projects);
      return {
        clients,
        selectedClient,
        selectedProject,
      };
    })
  );

  getClientBackgroundColor(
    client: Client,
    selectedClient: Client | undefined
  ): string {
    return client.id === selectedClient?.id ? 'bg-slate-200' : 'bg-white';
  }

  getProjectBackgroundColor(
    project: Project,
    selectedProject: Project | undefined
  ): string {
    return project.id === selectedProject?.id ? 'bg-slate-200' : 'bg-white';
  }

  onSelectClient(client: Client, selectedClient: Client | undefined) {
    if (client.id !== selectedClient?.id) {
      this.db.updateSelectedClient(client.id);
    }
  }

  onSelectProject(
    project: Project,
    selectedClient: Client | undefined,
    selectedProject: Project | undefined
  ) {
    if (selectedClient) {
      if (selectedProject && project.id !== selectedProject.id) {
        this.db.updateSelectedProject(selectedClient, project.id);
      }
    }
  }
}
