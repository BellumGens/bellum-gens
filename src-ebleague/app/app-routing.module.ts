import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TournamentHomeComponent } from './home/tournament-home.component';
import { TournamentFormatComponent } from './tournaments/tournament-format/tournament-format.component';

export const routes: Routes = [
  { path: '', component: TournamentHomeComponent, data: {
      title: 'Esports Business League',
      twitterTitle: 'Esports Business League | Esports бизнес лига',
      description: 'Esports Бизнес Лигата е аматьорско състезание за работещи геймъри по CS:GO и StarCraft II',
      twitterDescription: 'Esports Бизнес Лигата е аматьорско състезание за работещи геймъри по CS:GO и StarCraft II',
      image: '/assets/eb-league-logo-sm.png'
    }
  },
  { path: 'format', component: TournamentFormatComponent, data: {
      title: 'Esports Business League - Format',
      twitterTitle: 'Esports бизнес лига - формат',
      description: 'Esports Бизнес Лигата е аматьорско състезание за работещи геймъри по CS:GO и StarCraft II',
      twitterDescription: 'Esports Бизнес Лигата е аматьорско състезание за работещи геймъри по CS:GO и StarCraft II',
      image: '/assets/eb-league-logo-sm.png'
    }
  },
  { path: '**', component: TournamentHomeComponent, data: {
      title: 'Esports Business League',
      twitterTitle: 'Esports Business League | Esports бизнес лига',
      description: 'Esports Бизнес Лигата е аматьорско състезание за работещи геймъри по CS:GO и StarCraft II',
      twitterDescription: 'Esports Бизнес Лигата е аматьорско състезание за работещи геймъри по CS:GO и StarCraft II',
      image: '/assets/eb-league-logo-sm.png'
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
