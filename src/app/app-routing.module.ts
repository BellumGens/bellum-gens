import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlayerDetailsComponent } from './player-details/player-details.component';
import { TeamComponent } from './team/team.component';
import { HomeComponent } from './home/home.component';
import { TeamDetailsComponent } from './team-details/team-details.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'player-details', component: PlayerDetailsComponent },
  { path: 'player-details/:userid', component: PlayerDetailsComponent },
  { path: 'team', component: TeamComponent },
  { path: 'team-details/:teamid', component: TeamDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
