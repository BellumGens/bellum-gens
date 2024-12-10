import { Routes } from '@angular/router';
import { PlayerComponent } from './player.component';
import { CsPlayerComponent } from './cs-player/cs-player.component';
import { ScPlayerComponent } from './sc-player/sc-player.component';

export const routes: Routes = [
  { path: ':userid', component: PlayerComponent, children: [
    { path: '', redirectTo: 'cs', pathMatch: 'full' },
    { path: 'cs', component: CsPlayerComponent },
    { path: 'sc', component: ScPlayerComponent }
  ]},
  { path: ':userid/:newuser', component: PlayerComponent }
];
