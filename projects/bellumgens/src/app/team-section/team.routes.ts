import { Routes } from '@angular/router';
import { TeamadminGuard } from '../../../../common/src/public_api';
import { TeamDetailsComponent } from './team-details/team-details.component';
import { TeamNavComponent } from './team-nav/team-nav.component';
import { TeamPreferencesComponent } from './team-preferences/team-preferences.component';
import { TeamTournamentsComponent } from './team-tournaments/team-tournaments.component';
import { TeamComponent } from './team.component';

export const routes: Routes = [
  { path: '', component: TeamComponent },
  { path: 'myteams', component: TeamNavComponent },
  { path: ':teamid', component: TeamComponent, children: [
    { path: '', redirectTo: 'details', pathMatch: 'full' },
    { path: 'details', component: TeamDetailsComponent },
    { path: 'competitions', component: TeamTournamentsComponent },
    { path: 'strategies', loadChildren: () => import('../strategies/strategies.routes').then(m => m.routes) },
    { path: 'preferences', component: TeamPreferencesComponent, canActivate: [ TeamadminGuard ] }
  ] }
];
