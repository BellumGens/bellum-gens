import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'unauthorized/:message',
    renderMode: RenderMode.Client
  },
  {
    path: 'tournaments/csgo/:tournamentid',
    renderMode: RenderMode.Server
  },
  {
    path: 'tournaments/sc2/:tournamentid',
    renderMode: RenderMode.Server
  },
  {
    path: 'tournaments/admin/**',
    renderMode: RenderMode.Client
  },
  {
    path: 'tournaments/view/:tournamentId',
    renderMode: RenderMode.Client
  },
  {
    path: 'tournaments/manage/:tournamentId',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
