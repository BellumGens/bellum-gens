import {
  CartComponent,
  CheckoutComponent,
  OrderStatusComponent,
  ProductDetailComponent,
  ProductListComponent,
  TermsComponent
} from '../../../../common/src/public_api';
import { ShopComponent } from './shop.component';
import { routes } from './shop.routes';

describe('shop routes', () => {
  const shopRoute = routes[0];
  const children = shopRoute.children ?? [];
  const childFor = (path: string) => children.find(route => route.path === path);

  it('nests every shop page under one host component', () => {
    expect(routes.length).toBe(1);
    expect(shopRoute.path).toBe('');
    expect(shopRoute.component).toBe(ShopComponent);
    expect(children.length).toBe(6);
  });

  it('routes the catalog, product page, cart, checkout, order status and terms', () => {
    expect(childFor('')?.component).toBe(ProductListComponent);
    expect(childFor('product/:slug')?.component).toBe(ProductDetailComponent);
    expect(childFor('cart')?.component).toBe(CartComponent);
    expect(childFor('checkout')?.component).toBe(CheckoutComponent);
    expect(childFor('order/:id')?.component).toBe(OrderStatusComponent);
    expect(childFor('terms')?.component).toBe(TermsComponent);
  });

  it('carries the SEO metadata the base directive reads', () => {
    expect(shopRoute.data?.title).toContain('Shop');
    expect(shopRoute.data?.description).toBeTruthy();
    expect(shopRoute.data?.twitterTitle).toBeTruthy();
    expect(shopRoute.data?.twitterDescription).toBeTruthy();
    expect(shopRoute.data?.image).toBeTruthy();
  });
});
