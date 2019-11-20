import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TournamentHomeComponent } from './home/tournament-home.component';
import { TournamentFormatComponent } from './tournaments/tournament-format/tournament-format.component';

export const routes: Routes = [
  { path: '', component: TournamentHomeComponent, data: {
      title: 'Esports Business League',
      headerTitle: 'Esports Business League',
      headerTitleShort: 'EBL',
      twitterTitle: 'Esports Business League | Esports бизнес лига',
      description: 'Esports competition in business | Esports бизнес лига записване',
      twitterDescription: 'Esports competition in business | Esports бизнес лига записване'
    }
  },
  { path: 'tournament/format', component: TournamentFormatComponent, data: {
      title: 'Esports Business League',
      headerTitle: 'Esports Business League',
      headerTitleShort: 'EBL',
      twitterTitle: 'Esports Business League | Esports бизнес лига',
      description: 'Esports competition in business | Esports бизнес лига записване',
      twitterDescription: 'Esports competition in business | Esports бизнес лига записване'
    }
  },
  { path: '**', component: TournamentHomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
