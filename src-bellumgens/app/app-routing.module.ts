import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TeamOverviewComponent } from './team-section/team-overview/team-overview.component';
import { PlayerDetailsComponent } from './player-section/player-details/player-details.component';
import { TeamResultsComponent } from './search/search-results/team-results/team-results.component';
import { PlayerResultsComponent } from './search/search-results/player-results/player-results.component';
import { EmailconfirmComponent } from './emailconfirm/emailconfirm.component';
import { StrategyEditorComponent } from './team-section/team-strategies/strategy-editor/strategy-editor.component';
import { AppShellComponent } from './app-shell/app-shell.component';
import { TeamStrategiesComponent } from './team-section/team-strategies/team-strategies.component';
import { StrategyDetailsComponent } from './team-section/team-strategies/strategy-details/strategy-details.component';
import { TeamDetailsComponent } from './team-section/team-details/team-details.component';
import { TeamPreferencesComponent } from './team-section/team-preferences/team-preferences.component';
import { UserStrategiesComponent } from './player-section/user-strategies/user-strategies.component';
import { TeamadminGuard } from '../../src-common/guards/teamadmin.guard';
import { TeamNavComponent } from './team-section/team-nav/team-nav.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { TeamTournamentsComponent } from './team-section/team-tournaments/team-tournaments.component';
import { RegistrationComponent } from '../../src-common/lib/registration/registration.component';
import { UnauthorizedComponent } from '../../src-common/lib/unauthorized/unauthorized.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'app-shell', component: AppShellComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'unauthorized', redirectTo: 'unauthorized/', pathMatch: 'full' },
  { path: 'unauthorized/:message', component: UnauthorizedComponent },
  { path: 'emailconfirm', component: EmailconfirmComponent },
  { path: 'user/strategies', component: UserStrategiesComponent },
  { path: 'strategies', component: TeamStrategiesComponent, data: {
      title: 'CS:GO Strategies: find or create'
    }
  },
  { path: 'strategies/:query', component: TeamStrategiesComponent, data: {
      title: 'CS:GO Strategies: find or create'
    }
  },
  { path: 'strategies/edit/:stratid', component: StrategyEditorComponent },
  { path: 'strategies/details/:stratid', component: StrategyDetailsComponent, data: {
      title: 'Bellum Gens CS:GO Strategy'
    }
  },
  { path: 'emailconfirm/:error', component: EmailconfirmComponent },
  { path: 'players/:userid', component: PlayerDetailsComponent },
  { path: 'players/:userid/:newuser', component: PlayerDetailsComponent },
  { path: 'team/:teamid', component: TeamOverviewComponent, children: [
    { path: '', redirectTo: 'details', pathMatch: 'full' },
    { path: 'details', component: TeamDetailsComponent },
    { path: 'competitions', component: TeamTournamentsComponent },
    { path: 'strategies', component: TeamStrategiesComponent },
    { path: 'preferences', component: TeamPreferencesComponent, canActivate: [ TeamadminGuard ] }
  ] },
  { path: 'myteams', component: TeamNavComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'team/:teamid/:stratid', component: StrategyEditorComponent },
  { path: 'search/teams/:query', component: TeamResultsComponent },
  { path: 'search/players/:query', component: PlayerResultsComponent },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled',
                                           anchorScrolling: 'enabled',
                                           initialNavigation: 'enabled',
                                           relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
