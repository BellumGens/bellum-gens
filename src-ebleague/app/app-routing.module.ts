import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TournamentHomeComponent } from './home/home.component';
import { RaffleComponent } from './raffle/raffle.component';
import { RegistrationSuccessComponent } from './tournament-registration/registration-success/registration-success.component';
import { RegistrationComponent } from '../../src-common/components/registration/registration.component';
import { UnauthorizedComponent } from '../../src-common/components/unauthorized/unauthorized.component';
import { NewsComponent } from './news/news.component';

export const routes: Routes = [
  { path: '', component: TournamentHomeComponent },
  { path: 'raffle', component: RaffleComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'news', component: NewsComponent, data: {
      title: 'Esports Business League - News',
      twitterTitle: 'Esports бизнес лига - Новини',
      description: 'Esports Бизнес Лигата е аматьорско състезание за работещи геймъри по CS:GO и StarCraft II',
      twitterDescription: 'Esports Бизнес Лигата е аматьорско състезание за работещи геймъри по CS:GO и StarCraft II',
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
  { path: '**', component: TournamentHomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', initialNavigation: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
