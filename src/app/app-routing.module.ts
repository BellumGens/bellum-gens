import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { TeamOverviewComponent } from './team-section/team-overview/team-overview.component';
import { PlayerComponent } from './player-section/player/player.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'player-details', component: PlayerComponent },
  { path: 'player-details/:userid', component: PlayerComponent },
  { path: 'player-details/:userid/:newuser', component: PlayerComponent },
  { path: 'team', component: TeamOverviewComponent },
  { path: 'team/:teamid', component: TeamOverviewComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
