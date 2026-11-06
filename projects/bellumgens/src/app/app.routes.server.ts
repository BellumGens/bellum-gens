import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'emailconfirm/:error',
    renderMode: RenderMode.Client
  },
  {
    path: 'bellumgenselite/registration/:tournamentId',
    renderMode: RenderMode.Client
  },
  {
    path: 'bellumgenselite/events/**',
    renderMode: RenderMode.Client
  },
  {
    path: 'unauthorized/:message',
    renderMode: RenderMode.Client
  },
  {
    path: 'strategies/:query',
    renderMode: RenderMode.Client
  },
  {
    path: 'strategies/details/:stratid',
    renderMode: RenderMode.Client
  },
  {
    path: 'strategies/edit/**',
    renderMode: RenderMode.Client
  },
  {
    path: 'players/:userid',
    renderMode: RenderMode.Server
  },
  {
    path: 'players/:userid/:newuser',
    renderMode: RenderMode.Client
  },
  {
    path: 'team/:teamid',
    renderMode: RenderMode.Server
  },
  {
    path: 'team/:teamid/',
    renderMode: RenderMode.Server
  },
  {
    path: 'team/:teamid/details',
    renderMode: RenderMode.Server
  },
  {
    path: 'team/:teamid/competitions',
    renderMode: RenderMode.Server
  },
  {
    path: 'team/:teamid/**',
    renderMode: RenderMode.Client
  },
  {
    path: 'search/teams/:query',
    renderMode: RenderMode.Client
  },
  {
    path: 'search/players/:query',
    renderMode: RenderMode.Client
  },
  {
    path: 'tournaments/**',
    renderMode: RenderMode.Client
  },
  // The catalog is rendered on the server so products are crawlable; the cart, checkout and
  // order pages depend on browser state (localStorage, the payment redirect) and render on the client.
  {
    path: 'shop',
    renderMode: RenderMode.Server
  },
  {
    path: 'shop/product/:slug',
    renderMode: RenderMode.Server
  },
  {
    path: 'shop/cart',
    renderMode: RenderMode.Client
  },
  {
    path: 'shop/checkout',
    renderMode: RenderMode.Client
  },
  {
    path: 'shop/order/:id',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
