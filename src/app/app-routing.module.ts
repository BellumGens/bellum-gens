import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlayerDetailsComponent } from './player-details/player-details.component';
import { HomeComponent } from './home/home.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { TeamComponent } from './team-section/team/team.component';
import { TeamOverviewComponent } from './team-section/team-overview/team-overview.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'player-details', component: PlayerDetailsComponent },
  { path: 'player-details/:userid', component: PlayerDetailsComponent },
  { path: 'player-details/:userid/:newuser', component: PlayerDetailsComponent },
  { path: 'team', component: TeamComponent },
  { path: 'team-details/:teamid', component: TeamOverviewComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
