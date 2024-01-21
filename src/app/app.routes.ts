import { Routes } from '@angular/router';
import { ViewerComponent } from './viewer/viewer.component';
import { CreateQueueComponent } from './panel/create-queue/create-queue.component';
import { HomeComponent } from './pages/home/home.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {
    path: 'queue',
    children: [
      { path: 'view/:queueId', component: ViewerComponent },
      { path: 'create', component: CreateQueueComponent },
    ],
  },
  { path: '**', redirectTo: 'home' },
];
