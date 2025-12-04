import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'unauthorized/:message',
    renderMode: RenderMode.Client
  },
  {
    path: 'tournament/csgo/:tournamentid',
    renderMode: RenderMode.Server
  },
  {
    path: 'tournament/sc2/:tournamentid',
    renderMode: RenderMode.Server
  },
  {
    path: 'tournament/admin/*',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
