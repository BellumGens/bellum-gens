import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlayersComponent } from './players/players.component';
import { PlayerDetailsComponent } from './player-details/player-details.component';
import { TeamComponent } from './team/team.component';

export const routes: Routes = [
  { path: '', redirectTo: '/players', pathMatch: 'full' },
  { path: 'players', component: PlayersComponent },
  { path: 'player-details', component: PlayerDetailsComponent },
  { path: 'player-details/:userid', component: PlayerDetailsComponent },
  { path: 'team', component: TeamComponent, data: { text: 'team' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
