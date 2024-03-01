import { Routes } from '@angular/router';
import { TournamentComponent } from './tournament.component';
import { TournamentFormatComponent } from './tournament-format/tournament-format.component';
import { TournamentCsgoComponent } from './tournament-csgo/tournament-csgo.component';
import { TournamentSc2Component } from './tournament-sc2/tournament-sc2.component';
import { ProductionCrewComponent } from './production-crew/production-crew.component';
import { TournamentsMainComponent } from './tournaments-main/tournaments-main.component';

export const routes: Routes = [
  { path: '', component: TournamentComponent, children: [
    { path: '', component: TournamentsMainComponent },
    { path: 'csgo', redirectTo: 'csgo/', pathMatch: 'full' },
    { path: 'csgo/:tournamentid', component: TournamentCsgoComponent, data: {
        title: 'Esports Business League - CS:GO',
        twitterTitle: 'Esports бизнес лига - CS:GO',
        description: 'Esports Бизнес Лигата е аматьорско състезание за работещи геймъри по CS:GO и StarCraft II',
        twitterDescription: 'Esports Бизнес Лигата е аматьорско състезание за работещи геймъри по CS:GO и StarCraft II',
        image: '/assets/eb-league-logo-sm.png'
      }
    },
    { path: 'sc2', redirectTo: 'sc2/', pathMatch: 'full' },
    { path: 'sc2/:tournamentid', component: TournamentSc2Component, data: {
        title: 'Esports Business League - StarCraft II',
        twitterTitle: 'Esports бизнес лига - StarCraft II',
        description: 'Esports Бизнес Лигата е аматьорско състезание за работещи геймъри по CS:GO и StarCraft II',
        twitterDescription: 'Esports Бизнес Лигата е аматьорско състезание за работещи геймъри по CS:GO и StarCraft II',
        image: '/assets/eb-league-logo-sm.png'
      }
    }
  ] },
  { path: 'format', component: TournamentFormatComponent },
  { path: 'crew', component: ProductionCrewComponent }
];
