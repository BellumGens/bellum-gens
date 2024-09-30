import { Routes } from '@angular/router';
import { PartnersComponent } from './partners.component';
import { TechhubComponent } from './techhub/techhub.component';
import { VisitStaraZagoraComponent } from './visit-stara-zagora/visit-stara-zagora.component';
import { BulstreamComponent } from './bulstream/bulstream.component';

export const routes: Routes = [
  {
    path: '',
    component: PartnersComponent,
    data: {
      title: 'Bellum Gens Partners: Our partners and sponsors',
      twitterTitle: 'Bellum Gens Partners: Our partners and sponsors',
      description: 'Bellum Gens partners and sponsors are the best in the business. Check out who supports us.',
      twitterDescription: 'Bellum Gens partners and sponsors are the best in the business. Check out who supports us.'
    },
    children: [
      { path: '', redirectTo: 'techhub', pathMatch: 'full' },
      {
        path: 'techhub', component: TechhubComponent, data: {
          title: 'Bellum Gens Partners: TechHub.bg',
          twitterTitle: 'Bellum Gens Partners: TechHub.bg',
          description: 'Bellum Gens partners and sponsors are the best in the business. Check out who supports us.',
          twitterDescription: 'Bellum Gens partners and sponsors are the best in the business. Check out who supports us.'
        }
      },
      {
        path: 'visit-stara-zagora', component: VisitStaraZagoraComponent, data: {
          title: 'Bellum Gens Partners: Visit Stara Zagora',
          twitterTitle: 'Bellum Gens Partners: Visit Stara Zagora',
          description: 'Bellum Gens partners and sponsors are the best in the business. Check out who supports us.',
          twitterDescription: 'Bellum Gens partners and sponsors are the best in the business. Check out who supports us.'
        }
      },
      {
        path: 'bulstream', component: BulstreamComponent, data: {
          title: 'Bellum Gens Partners: BulStream',
          twitterTitle: 'Bellum Gens Partners: BulStream',
          description: 'Bellum Gens partners and sponsors are the best in the business. Check out who supports us.',
          twitterDescription: 'Bellum Gens partners and sponsors are the best in the business. Check out who supports us.'
        }
      }
    ]
  },
];
