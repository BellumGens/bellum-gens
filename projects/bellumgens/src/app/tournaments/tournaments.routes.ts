import { Routes } from '@angular/router';
import { TournamentListComponent, TournamentCreateComponent, TournamentDetailComponent } from '../../../../common/src/public_api';

export const routes: Routes = [
  {
    path: '',
    component: TournamentListComponent,
    data: {
      title: 'Tournaments - Bellum Gens',
      twitterTitle: 'Tournaments - Bellum Gens',
      description: 'Browse and join esports tournaments on Bellum Gens. Create your own tournaments, compete with others, and manage your events.',
      twitterDescription: 'Browse and join esports tournaments on Bellum Gens.',
      image: '/assets/avatar_BG_blood.png'
    }
  },
  {
    path: 'create',
    component: TournamentCreateComponent,
    data: {
      title: 'Create Tournament - Bellum Gens',
      twitterTitle: 'Create Tournament - Bellum Gens',
      description: 'Create a new esports tournament on Bellum Gens.',
      twitterDescription: 'Create a new esports tournament on Bellum Gens.',
      image: '/assets/avatar_BG_blood.png'
    }
  },
  {
    path: 'manage/:tournamentId',
    component: TournamentCreateComponent,
    data: {
      title: 'Edit Tournament - Bellum Gens',
      twitterTitle: 'Edit Tournament - Bellum Gens',
      description: 'Edit your tournament settings on Bellum Gens.',
      twitterDescription: 'Edit your tournament settings on Bellum Gens.',
      image: '/assets/avatar_BG_blood.png'
    }
  },
  {
    path: 'view/:tournamentId',
    component: TournamentDetailComponent,
    data: {
      title: 'Tournament Details - Bellum Gens',
      twitterTitle: 'Tournament Details - Bellum Gens',
      description: 'View tournament details, participants, and match results.',
      twitterDescription: 'View tournament details, participants, and match results.',
      image: '/assets/avatar_BG_blood.png'
    }
  }
];
