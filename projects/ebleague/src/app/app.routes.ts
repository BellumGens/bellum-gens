import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegistrationComponent, UnauthorizedComponent } from '../../../common/src/public_api';
import { NewsComponent } from './news/news.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'giveaway', redirectTo: 'raffle', pathMatch: 'full' },
  { path: 'raffle', loadComponent: () => import('./raffle/raffle.component').then(c => c.RaffleComponent) },
  { path: 'register', component: RegistrationComponent },
  { path: 'news', component: NewsComponent, data: {
      title: 'Esports Business League - News',
      twitterTitle: 'Esports Business League - News',
      description: 'Esports Business League is an amateur esports competition at the workplace in Counter-Strike and StarCraft II',
      twitterDescription: 'Esports Business League is an amateur esports competition at the workplace in Counter-Strike and StarCraft II',
      image: '/assets/crew/sugarbunny.jpg'
    }
  },
  { path: 'registration-success', loadComponent: () => import('./tournament-registration/registration-success/registration-success.component').then(c => c.RegistrationSuccessComponent) },
  { path: 'unauthorized', redirectTo: 'unauthorized/', pathMatch: 'full' },
  { path: 'unauthorized/:message', component: UnauthorizedComponent },
  { path: 'format', redirectTo: '/tournament/format', pathMatch: 'full' },
  { path: 'csgo', redirectTo: '/tournament/csgo/', pathMatch: 'full' },
  { path: 'sc2', redirectTo: '/tournament/sc2/', pathMatch: 'full' },
  { path: 'admin', loadChildren: () => import('./admin/admin.routes').then(m => m.routes) },
  { path: 'tournament', loadChildren: () => import('./tournaments/tournament.routes').then(m => m.routes) },
  { path: 'shop', loadChildren: () => import('./shop/shop.routes').then(m => m.routes) },
  { path: '**', component: HomeComponent }
];
