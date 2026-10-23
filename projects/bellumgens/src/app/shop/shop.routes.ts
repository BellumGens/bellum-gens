import { Routes } from '@angular/router';
import {
  CartComponent,
  CheckoutComponent,
  OrderStatusComponent,
  ProductDetailComponent,
  ProductListComponent
} from '../../../../common/src/public_api';
import { ShopComponent } from './shop.component';

const seo = {
  title: 'Bellum Gens Shop: Official Merchandise',
  twitterTitle: 'Bellum Gens Shop: Official Merchandise',
  description: 'Official Bellum Gens, Esports Business League and BGE Stara Zagora merchandise: jerseys, umbrellas, pens and more. Secure payment with Revolut, delivery across Bulgaria.',
  twitterDescription: 'Official Bellum Gens, Esports Business League and BGE Stara Zagora merchandise. Secure payment with Revolut.',
  image: '/assets/avatar_BG_blood.png'
};

export const routes: Routes = [
  {
    path: '',
    component: ShopComponent,
    data: seo,
    children: [
      { path: '', component: ProductListComponent },
      { path: 'product/:slug', component: ProductDetailComponent },
      { path: 'cart', component: CartComponent },
      { path: 'checkout', component: CheckoutComponent },
      { path: 'order/:id', component: OrderStatusComponent }
    ]
  }
];
