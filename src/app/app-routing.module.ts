import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TeamOverviewComponent } from './team-section/team-overview/team-overview.component';
import { PlayerDetailsComponent } from './player-section/player-details/player-details.component';
import { TeamResultsComponent } from './search/search-results/team-results/team-results.component';
import { PlayerResultsComponent } from './search/search-results/player-results/player-results.component';
import { EmailconfirmComponent } from './emailconfirm/emailconfirm.component';
import { StrategyEditorComponent } from './team-section/team-strategies/strategy-editor/strategy-editor.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { AddSteamComponent } from './add-steam/add-steam.component';
import { AppShellComponent } from './app-shell/app-shell.component';
import { TeamStrategiesComponent } from './team-section/team-strategies/team-strategies.component';
import { StrategyDetailsComponent } from './team-section/team-strategies/strategy-details/strategy-details.component';
import { TeamDetailsComponent } from './team-section/team-details/team-details.component';
import { TeamPreferencesComponent } from './team-section/team-preferences/team-preferences.component';
import { UserStrategiesComponent } from './player-section/user-strategies/user-strategies.component';
import { TournamentHomeComponent } from './tournaments/tournament-home/tournament-home.component';
import { TournamentFormatComponent } from './tournaments/tournament-format/tournament-format.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'app-shell', component: AppShellComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: 'emailconfirm', component: EmailconfirmComponent },
  { path: 'tournament-signup', component: TournamentHomeComponent, data: {
      title: 'Esports Business League',
      headerTitle: 'Esports Business League',
      headerTitleShort: 'EBL',
      twitterTitle: 'Esports Business League | Esports бизнес лига',
      description: 'Esports competition in business | Esports бизнес лига записване',
      twitterDescription: 'Esports competition in business | Esports бизнес лига записване'
    }
  },
  { path: 'tournament/format', component: TournamentFormatComponent },
  { path: 'addsteam', component: AddSteamComponent },
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
  { path: 'strategies/details/:stratid', component: StrategyDetailsComponent },
  { path: 'emailconfirm/:error', component: EmailconfirmComponent },
  { path: 'players/:userid', component: PlayerDetailsComponent },
  { path: 'players/:userid/:newuser', component: PlayerDetailsComponent },
  { path: 'team/:teamid', component: TeamOverviewComponent, children: [
    { path: '', redirectTo: 'details', pathMatch: 'full' },
    { path: 'details', component: TeamDetailsComponent },
    { path: 'strategies', component: TeamStrategiesComponent },
    { path: 'preferences', component: TeamPreferencesComponent }
  ] },
  { path: 'team/:teamid/:stratid', component: StrategyEditorComponent },
  { path: 'search/teams/:query', component: TeamResultsComponent },
  { path: 'search/players/:query', component: PlayerResultsComponent },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
