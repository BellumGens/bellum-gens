import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShopComponent } from './shop.component';
import { OrderSuccessComponent } from './order-success/order-success.component';

const routes: Routes = [
  { path: '', component: ShopComponent, data: {
      title: 'Esports Business League - Shop',
      twitterTitle: 'Esports бизнес лига - Магазин',
      description: 'Лимитирана серия Esports Business League тениска направена от 100% дишащ полиестер, с висококачествен печат. Идеална е както за продължителни гейминг сесии, така и за спорт на открито!',
      twitterDescription: 'Лимитирана серия Esports Business League тениска направена от 100% дишащ полиестер, с висококачествен печат. Идеална е както за продължителни гейминг сесии, така и за спорт на открито!',
      image: '/assets/wallpapers/jersey-front-back.png'
    }
  },
  { path: 'order-success', component: OrderSuccessComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopRoutingModule { }
