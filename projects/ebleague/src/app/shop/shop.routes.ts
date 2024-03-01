import { Routes } from '@angular/router';
import { ShopComponent } from './shop.component';
import { OrderSuccessComponent } from './order-success/order-success.component';

export const routes: Routes = [
  { path: '', component: ShopComponent, data: {
      title: 'Esports Business League - Shop',
      twitterTitle: 'Esports бизнес лига - Магазин',
      // eslint-disable-next-line max-len
      description: 'Лимитирана серия Esports Business League тениска направена от 100% дишащ полиестер, с висококачествен печат. Идеална е както за продължителни гейминг сесии, така и за спорт на открито!',
      // eslint-disable-next-line max-len
      twitterDescription: 'Лимитирана серия Esports Business League тениска направена от 100% дишащ полиестер, с висококачествен печат. Идеална е както за продължителни гейминг сесии, така и за спорт на открито!',
      image: '/assets/wallpapers/jersey-front-back.png'
    }
  },
  { path: 'order-success', component: OrderSuccessComponent }
];
