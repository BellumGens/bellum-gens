import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TournamentHomeComponent } from './home/tournament-home.component';
import { TournamentFormatComponent } from './tournaments/tournament-format/tournament-format.component';
import { TournamentCsgoComponent } from './tournaments/tournament-csgo/tournament-csgo.component';
import { TournamentSc2Component } from './tournaments/tournament-sc2/tournament-sc2.component';

export const routes: Routes = [
  { path: '', component: TournamentHomeComponent },
  { path: 'format', component: TournamentFormatComponent },
  { path: 'csgo', component: TournamentCsgoComponent, data: {
      title: 'Esports Business League - CS:GO',
      twitterTitle: 'Esports бизнес лига - CS:GO',
      description: 'Esports Бизнес Лигата е аматьорско състезание за работещи геймъри по CS:GO и StarCraft II',
      twitterDescription: 'Esports Бизнес Лигата е аматьорско състезание за работещи геймъри по CS:GO и StarCraft II',
      image: '/assets/eb-league-logo-sm.png'
    }
  },
  { path: 'sc2', component: TournamentSc2Component, data: {
      title: 'Esports Business League - StarCraft II',
      twitterTitle: 'Esports бизнес лига - StarCraft II',
      description: 'Esports Бизнес Лигата е аматьорско състезание за работещи геймъри по CS:GO и StarCraft II',
      twitterDescription: 'Esports Бизнес Лигата е аматьорско състезание за работещи геймъри по CS:GO и StarCraft II',
      image: '/assets/eb-league-logo-sm.png'
    }
  },
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
  { path: '**', component: TournamentHomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
