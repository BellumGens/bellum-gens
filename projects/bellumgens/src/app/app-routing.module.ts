import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TeamadminGuard } from '../../../common/src/public_api';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register', loadComponent: () => import('../../../common/src/public_api').then(m => m.RegistrationComponent) },
  { path: 'unauthorized', redirectTo: 'unauthorized/', pathMatch: 'full' },
  { path: 'unauthorized/:message', loadComponent: () => import('../../../common/src/public_api').then(m => m.UnauthorizedComponent) },
  { path: 'emailconfirm', loadComponent: () => import('./emailconfirm/emailconfirm.component').then(m => m.EmailconfirmComponent) },
  { path: 'emailconfirm/:error', loadComponent: () => import('./emailconfirm/emailconfirm.component').then(m => m.EmailconfirmComponent) },
  { path: 'strategies', loadComponent: () => import('./strategies/strategies.component').then(m => m.StrategiesComponent) },
  { path: 'strategies/user', loadComponent: () => import('./strategies/strategies.component').then(m => m.StrategiesComponent) },
  { path: 'strategies/:query', loadComponent: () => import('./strategies/strategies.component').then(m => m.StrategiesComponent) },
  { path: 'strategies/edit/:stratid', loadComponent: () => import('./strategies/strategy-editor/strategy-editor.component').then(m => m.StrategyEditorComponent) },
  { path: 'strategies/details/:stratid', loadComponent: () => import('./strategies/strategy-details/strategy-details.component').then(m => m.StrategyDetailsComponent) },
  { path: 'players/:userid', loadComponent: () => import('./player-section/player.component').then(m => m.PlayerComponent) },
  { path: 'players/:userid/:newuser', loadComponent: () => import('./player-section/player.component').then(m => m.PlayerComponent) },
  { path: 'team/myteams', loadComponent: () => import('./team-section/team-nav/team-nav.component').then(m => m.TeamNavComponent) },
  { path: 'team/:teamid', loadComponent: () => import('./team-section/team.component').then(m => m.TeamComponent), children: [
    { path: '', redirectTo: 'details', pathMatch: 'full' },
    { path: 'details', loadComponent: () => import('./team-section/team-details/team-details.component').then(m => m.TeamDetailsComponent) },
    { path: 'competitions', loadComponent: () => import('./team-section/team-tournaments/team-tournaments.component').then(m => m.TeamTournamentsComponent) },
    { path: 'strategies', loadComponent: () => import('./strategies/strategies.component').then(m => m.StrategiesComponent) },
    { path: 'preferences', loadComponent: () => import('./team-section/team-preferences/team-preferences.component').then(m => m.TeamPreferencesComponent), canActivate: [ TeamadminGuard ] }
  ] },
  { path: 'notifications', loadComponent: () => import('./notifications/notifications.component').then(m => m.NotificationsComponent) },
  { path: 'search/teams/:query', loadComponent: () => import('./search/search-results/team-results/team-results.component').then(m => m.TeamResultsComponent) },
  { path: 'search/players/:query', loadComponent: () => import('./search/search-results/player-results/player-results.component').then(m => m.PlayerResultsComponent) },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled',
                                           anchorScrolling: 'enabled',
                                           initialNavigation: 'enabledBlocking' })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
