import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlayersComponent } from './players/players.component';
import { PlayerDetailsComponent } from './player-details/player-details.component';
import { TeamComponent } from './team/team.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'player-details', component: PlayerDetailsComponent },
  { path: 'player-details/:userid', component: PlayerDetailsComponent },
  { path: 'team', component: TeamComponent, data: { text: 'team' } },
  { path: 'team/:teamid', component: TeamComponent, data: { text: 'team' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
