import { Routes } from '@angular/router';
import { PartnersComponent } from './partners.component';
import { TechhubComponent } from './techhub/techhub.component';

export const routes: Routes = [
  { path: '', component: PartnersComponent, data: {
    title: 'Bellum Gens Partners: Our partners and sponsors',
    twitterTitle: 'Bellum Gens Partners: Our partners and sponsors',
    description: 'Bellum Gens partners and sponsors are the best in the business. Check out who supports us.',
    twitterDescription: 'Bellum Gens partners and sponsors are the best in the business. Check out who supports us.'
  } },
  { path: 'techhub', component: TechhubComponent, data: {
    title: 'Bellum Gens Partners: TechHub.bg',
    twitterTitle: 'Bellum Gens Partners: TechHub.bg',
    description: 'Bellum Gens partners and sponsors are the best in the business. Check out who supports us.',
    twitterDescription: 'Bellum Gens partners and sponsors are the best in the business. Check out who supports us.'
  } }
];
