import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RaffleComponent } from './raffle/raffle.component';
import { RegistrationSuccessComponent } from './tournament-registration/registration-success/registration-success.component';
import { RegistrationComponent, UnauthorizedComponent } from '../../../common/src/public_api';
import { NewsComponent } from './news/news.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'giveaway', redirectTo: 'raffle', pathMatch: 'full' },
  { path: 'raffle', component: RaffleComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'news', component: NewsComponent, data: {
      title: 'Esports Business League - News',
      twitterTitle: 'Esports Business League - News',
      description: 'Esports Business League is an amateur esports competition at the workplace in CS:GO and StarCraft II',
      twitterDescription: 'Esports Business League is an amateur esports competition at the workplace in CS:GO and StarCraft II',
      image: '/assets/crew/sugarbunny.jpg'
    }
  },
  { path: 'registration-success', component: RegistrationSuccessComponent },
  { path: 'unauthorized', redirectTo: 'unauthorized/', pathMatch: 'full' },
  { path: 'unauthorized/:message', component: UnauthorizedComponent },
  { path: 'format', redirectTo: '/tournament/format', pathMatch: 'full' },
  { path: 'csgo', redirectTo: '/tournament/csgo/', pathMatch: 'full' },
  { path: 'sc2', redirectTo: '/tournament/sc2/', pathMatch: 'full' },
  { path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule) },
  { path: 'tournament', loadChildren: () => import('./tournaments/tournament.module').then(m => m.TournamentModule) },
  { path: 'shop', loadChildren: () => import('./shop/shop.module').then(m => m.ShopModule) },
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled',
                                           anchorScrolling: 'enabled',
                                           initialNavigation: 'enabledBlocking' })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
