/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
} from '@angular/fire/firestore';
import {
  Activity,
  Client,
  Project,
  SettingsConfig,
} from '@pem-activity-tracker/activity-tracker-types';
import { updateDoc } from 'firebase/firestore';
import {
  BehaviorSubject,
  Observable,
  Subject,
  Subscription,
  catchError,
  combineLatest,
  from,
  map,
  of,
} from 'rxjs';

class Subcollection<T> {
  private subscription: Subscription | null = null;

  constructor(private output: Subject<T[]>) {}

  connect(db: Firestore, collectionPath: string) {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
    this.subscription = getCollection$<T>(db, collectionPath).subscribe(
      (data) => {
        this.output.next(data);
      }
    );
  }

  disconnect() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
      this.output.next([]);
    }
  }
}

@Injectable({ providedIn: 'root' })
export class AfClientDataService {
  private db = inject(Firestore);

  settings$: Observable<SettingsConfig[]>;
  clients$: Observable<Client[]>;

  private projectsSubject$ = new BehaviorSubject<Project[]>([]);
  projects$ = this.projectsSubject$.asObservable();
  private activitiesSubject$ = new BehaviorSubject<Activity[]>([]);
  activities$ = this.activitiesSubject$.asObservable();
  private projectsSubcollection = new Subcollection(this.projectsSubject$);
  private activitiesSubcollection = new Subcollection(this.activitiesSubject$);

  selectedClient$: Observable<Client | undefined>;
  selectedProject$: Observable<Project | undefined>;

  constructor() {
    this.clients$ = getCollection$<Client>(this.db, 'clients').pipe(
      map((clients) => {
        if (clients.length > 0) {
          for (let i = 1; i <= 25; i++) {
            clients.push({ ...clients[0], id: i.toString() });
          }
        }
        return clients;
      })
    );
    this.settings$ = getCollection$<SettingsConfig>(this.db, 'settings');

    this.selectedClient$ = combineLatest([this.clients$, this.settings$]).pipe(
      map(([clients, settings]) => {
        if (settings.length < 1) {
          this.projectsSubcollection.disconnect();
          return undefined;
        }
        const selectedClient = clients.find(
          (el) => el.id === settings[0].selectedClientId
        );
        if (selectedClient) {
          this.projectsSubcollection.connect(
            this.db,
            `clients/${selectedClient.id}/projects`
          );
        } else {
          this.projectsSubcollection.disconnect();
        }
        return selectedClient;
      })
    );

    this.selectedProject$ = combineLatest([
      this.selectedClient$,
      this.projects$,
    ]).pipe(
      map(([selectedClient, projects]) => {
        if (selectedClient && selectedClient.selectedProjectId) {
          const selectedProject = projects.find(
            (el) => el.id === selectedClient.selectedProjectId
          );
          if (selectedProject) {
            this.activitiesSubcollection.connect(
              this.db,
              `clients/${selectedClient.id}/projects/${selectedProject.id}/activities`
            );
          } else {
            this.activitiesSubcollection.disconnect();
          }
          return selectedProject;
        }
        this.projectsSubcollection.disconnect();
        this.activitiesSubcollection.disconnect();
        return undefined;
      })
    );
  }

  updateSelectedClient(clientId: string): Observable<void> {
    const docRef = doc(this.db, 'settings/config');
    return from(updateDoc(docRef, { selectedClientId: clientId }));
  }

  updateSelectedProject(client: Client, selectedProjectId: string) {
    const docRef = doc(this.db, `clients/${client.id}`);
    return from(
      updateDoc(docRef, {
        selectedProjectId,
      })
    );
  }
}

const getCollection$ = <T>(db: Firestore, path: string): Observable<T[]> => {
  return (
    collectionData(collection(db, path), {
      idField: 'id',
    }) as Observable<T[]>
  ).pipe(
    catchError((err) => {
      console.log(err);
      return of([] as T[]);
    })
  );
};
