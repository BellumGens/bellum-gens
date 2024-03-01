import { Routes } from '@angular/router';
import { PlayerComponent } from './player.component';

export const routes: Routes = [
  { path: ':userid', component: PlayerComponent },
  { path: ':userid/:newuser', component: PlayerComponent }
];
