import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TeamResultsComponent } from './search/search-results/team-results/team-results.component';
import { PlayerResultsComponent } from './search/search-results/player-results/player-results.component';
import { EmailconfirmComponent } from './emailconfirm/emailconfirm.component';
import { RegistrationComponent, UnauthorizedComponent } from '../../../common/src/public_api';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'bellumgenselite', loadComponent: () => import('./events/events.component').then(m => m.EventsComponent), data: {
      title: 'Bellum Gens Elite Stara Zagora: The home of esports in Bulgaria',
      twitterTitle: 'Bellum Gens Elite Stara Zagora: The home of esports in Bulgaria',
      description: 'Bellum Gens Elite Stara Zagora is the home of esports in Bulgaria. We host the best gaming events in the country.',
      twitterDescription: 'Bellum Gens Elite Stara Zagora is the home of esports in Bulgaria. We host the best gaming events in the country.'
    }
  },
  { path: 'partners', loadChildren: () => import('./partners/partners.routes').then(m => m.routes) },
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
