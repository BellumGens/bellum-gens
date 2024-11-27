import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'emailconfirm/:error',
    renderMode: RenderMode.Client
  },
  {
    path: 'bellumgenselite/registration/:tournamentId',
    renderMode: RenderMode.Server
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
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
