import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TeamResultsComponent } from './search/search-results/team-results/team-results.component';
import { PlayerResultsComponent } from './search/search-results/player-results/player-results.component';
import { EmailconfirmComponent } from './emailconfirm/emailconfirm.component';
import { RegistrationComponent, UnauthorizedComponent } from '../../../common/src/public_api';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'bellumgenselite', loadChildren: () => import('./events/events.routes').then(m => m.routes) },
  { path: 'partners', loadChildren: () => import('./partners/partners.routes').then(m => m.routes) },
  { path: 'elite-stara-zagora-2026', loadComponent: () => import('./elite-stz-2026/elite-stz-2026.component').then(m => m.EliteStz2026Component) },
  { path: 'register', component: RegistrationComponent },
  { path: 'unauthorized', redirectTo: 'unauthorized/', pathMatch: 'full' },
  { path: 'unauthorized/:message', component: UnauthorizedComponent },
  { path: 'emailconfirm', component: EmailconfirmComponent },
  { path: 'strategies', loadChildren: () => import('./strategies/strategies.routes').then(m => m.routes) },
  { path: 'emailconfirm/:error', component: EmailconfirmComponent },
  { path: 'players', loadChildren: () => import('./player-section/player.routes').then(m => m.routes) },
  { path: 'team', loadChildren: () => import('./team-section/team.routes').then(m => m.routes) },
  { path: 'notifications', loadComponent: () => import('./notifications/notifications.component').then(m => m.NotificationsComponent) },
  { path: 'search/teams/:query', component: TeamResultsComponent },
  { path: 'search/players/:query', component: PlayerResultsComponent },
  { path: '**', component: HomeComponent }
];
