import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { TeamOverviewComponent } from './team-section/team-overview/team-overview.component';
import { PlayerComponent } from './player-section/player/player.component';
import { PlayerDetailsComponent } from './player-section/player-details/player-details.component';
import { TeamComponent } from './team-section/team/team.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'players',
    component: PlayerComponent,
    children: [
      { path: ':userid', component: PlayerDetailsComponent },
      { path: ':userid/:newuser', component: PlayerDetailsComponent }
    ]
  },
  { path: 'team',
    component: TeamComponent,
    children: [
      { path: ':teamid', component: TeamOverviewComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
