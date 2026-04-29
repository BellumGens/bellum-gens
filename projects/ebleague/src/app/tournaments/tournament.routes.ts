import { Routes } from '@angular/router';
import { TournamentComponent } from './tournament.component';
import { TournamentFormatComponent } from './tournament-format/tournament-format.component';
import { TournamentCsgoComponent } from './tournament-csgo/tournament-csgo.component';
import { TournamentSc2Component } from './tournament-sc2/tournament-sc2.component';
import { ProductionCrewComponent } from './production-crew/production-crew.component';
import { TournamentsMainComponent } from './tournaments-main/tournaments-main.component';
import { TournamentListComponent, TournamentCreateComponent, TournamentDetailComponent } from '../../../../common/src/public_api';

export const routes: Routes = [
  { path: '', component: TournamentComponent, children: [
    { path: '', component: TournamentsMainComponent },
    { path: 'csgo', redirectTo: 'csgo/', pathMatch: 'full' },
    { path: 'csgo/:tournamentid', component: TournamentCsgoComponent, data: {
        title: 'Esports Business League - Counter-Strike',
        twitterTitle: 'Esports бизнес лига - Counter-Strike',
        description: 'Esports Бизнес Лигата е аматьорско състезание за работещи геймъри по Counter-Strike и StarCraft II',
        twitterDescription: 'Esports Бизнес Лигата е аматьорско състезание за работещи геймъри по Counter-Strike и StarCraft II',
        image: '/assets/eb-league-logo-sm.png'
      }
    },
    { path: 'sc2', redirectTo: 'sc2/', pathMatch: 'full' },
    { path: 'sc2/:tournamentid', component: TournamentSc2Component, data: {
        title: 'Esports Business League - StarCraft II',
        twitterTitle: 'Esports бизнес лига - StarCraft II',
        description: 'Esports Бизнес Лигата е аматьорско състезание за работещи геймъри по Counter-Strike и StarCraft II',
        twitterDescription: 'Esports Бизнес Лигата е аматьорско състезание за работещи геймъри по Counter-Strike и StarCraft II',
        image: '/assets/eb-league-logo-sm.png'
      }
    }
  ] },
  { path: 'format', component: TournamentFormatComponent },
  { path: 'crew', component: ProductionCrewComponent },
  {
    path: 'hub',
    component: TournamentListComponent,
    data: {
      title: 'Tournaments - Esports Business League',
      twitterTitle: 'Tournaments - Esports Business League',
      description: 'Browse and join esports tournaments on Esports Business League. Create your own tournaments, compete with others, and manage your events.',
      twitterDescription: 'Browse and join esports tournaments on Esports Business League.',
      image: '/assets/eb-league-logo-sm.png'
    }
  },
  {
    path: 'create',
    component: TournamentCreateComponent,
    data: {
      title: 'Create Tournament - Esports Business League',
      twitterTitle: 'Create Tournament - Esports Business League',
      description: 'Create a new esports tournament on Esports Business League.',
      twitterDescription: 'Create a new esports tournament on Esports Business League.',
      image: '/assets/eb-league-logo-sm.png'
    }
  },
  {
    path: 'manage/:tournamentId',
    component: TournamentCreateComponent,
    data: {
      title: 'Edit Tournament - Esports Business League',
      twitterTitle: 'Edit Tournament - Esports Business League',
      description: 'Edit your tournament settings on Esports Business League.',
      twitterDescription: 'Edit your tournament settings on Esports Business League.',
      image: '/assets/eb-league-logo-sm.png'
    }
  },
  {
    path: 'view/:tournamentId',
    component: TournamentDetailComponent,
    data: {
      title: 'Tournament Details - Esports Business League',
      twitterTitle: 'Tournament Details - Esports Business League',
      description: 'View tournament details, participants, and match results.',
      twitterDescription: 'View tournament details, participants, and match results.',
      image: '/assets/eb-league-logo-sm.png'
    }
  },
  { path: 'format', component: TournamentFormatComponent },
  { path: 'crew', component: ProductionCrewComponent }
];
