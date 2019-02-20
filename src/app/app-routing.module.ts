import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TeamOverviewComponent } from './team-section/team-overview/team-overview.component';
import { PlayerDetailsComponent } from './player-section/player-details/player-details.component';
import { TeamResultsComponent } from './search/search-results/team-results/team-results.component';
import { PlayerResultsComponent } from './search/search-results/player-results/player-results.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'players/:userid', component: PlayerDetailsComponent },
  { path: 'players/:userid/:newuser', component: PlayerDetailsComponent },
  { path: 'team/:teamid', component: TeamOverviewComponent },
  { path: 'search/teams/:query', component: TeamResultsComponent },
  { path: 'search/players/:query', component: PlayerResultsComponent },
  { path: '**', component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
