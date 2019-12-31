import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TournamentHomeComponent } from './home/tournament-home.component';
import { TournamentFormatComponent } from './tournaments/tournament-format/tournament-format.component';
import { TournamentCsgoComponent } from './tournaments/tournament-csgo/tournament-csgo.component';
import { TournamentSc2Component } from './tournaments/tournament-sc2/tournament-sc2.component';

export const routes: Routes = [
  { path: '', component: TournamentHomeComponent, data: {
      title: 'Esports Business League',
      twitterTitle: 'Esports Business League | Бизнес лига по електронни спортове',
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
  { path: '**', component: TournamentHomeComponent, data: {
      title: 'Esports Business League',
      twitterTitle: 'Esports Business League | Бизнес лига по електронни спортове',
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
