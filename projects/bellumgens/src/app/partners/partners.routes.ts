import { Routes } from '@angular/router';
import { PartnersComponent } from './partners.component';

export const routes: Routes = [
  { path: '', component: PartnersComponent, data: {
    title: 'Bellum Gens Partners: Our partners and sponsors',
    twitterTitle: 'Bellum Gens Partners: Our partners and sponsors',
    description: 'Bellum Gens partners and sponsors are the best in the business. Check out who supports us.',
    twitterDescription: 'Bellum Gens partners and sponsors are the best in the business. Check out who supports us.'
  } }
];
