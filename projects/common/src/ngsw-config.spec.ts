import { Generator } from '@angular/service-worker/config';
import ngswConfig from './ngsw-config.json';
import { environment } from './environments/environment.prod';

/**
 * The service worker caches API responses for a day in a cache shared by everyone using the browser, so
 * its data group must only ever match public endpoints. The worker builds each pattern with
 * `new RegExp(pattern)` and no anchors, which is why every URL in the config ends in `$`. These tests compile
 * the config with Angular's own generator and match URLs the way the worker does.
 */
describe('ngsw-config', () => {
  const api = environment.apiEndpoint;
  let patterns: RegExp[];

  beforeAll(async () => {
    const fs = { list: async () => [], read: async () => '', hash: async () => '', write: async () => undefined };
    // The generator types its output as a plain Object; this is the part of the shape the worker reads.
    const compiled = await new Generator(fs, '/').process(ngswConfig as never) as { dataGroups: { patterns: string[] }[] };
    patterns = compiled.dataGroups.flatMap(group => group.patterns.map(p => new RegExp(p)));
  });

  const cached = (url: string) => patterns.some(pattern => pattern.test(url));

  it('points at the production API', () => {
    for (const group of ngswConfig.dataGroups) {
      for (const url of group.urls) {
        expect(url.startsWith(`${api}/`)).toBe(true);
      }
    }
  });

  it.each([
    '/companies',
    '/shop/products',
    '/shop/products?brand=1',
    '/shop/products/ebl%20jersey',
    '/strategy/strategies?page=0',
    '/teams?teamid=t1',
    '/teams/availability?teamid=t1',
    '/teams/members?teamid=t1',
    '/teams/tournaments?teamid=t1',
    '/tournament?id=1',
    '/tournament/activetournament',
    '/tournament/tournaments',
    '/tournament/regcount?tournamentId=1',
    '/tournament/csgoregs',
    '/tournament/csgoregs?tournamentId=1',
    '/tournament/sc2regs?tournamentId=1',
    '/tournament/sc2groups?tournamentId=1',
    '/tournament/sc2matches?tournamentId=1',
    '/users?userid=u1',
    '/users/availability?userid=u1',
    '/users/mapPool?userid=u1',
    '/users/tournaments?userid=u1',
    '/users/usergroups?userid=u1'
  ])('caches the public endpoint %s', path => {
    expect(cached(`${api}${path}`)).toBe(true);
  });

  it.each([
    // Private endpoints and anything below a cached path.
    '/shop/orders/mine',
    '/shop/orders/o1',
    '/shop/quote',
    '/shopadmin/orders',
    '/shop/products/ebl-jersey/private',
    '/companies/mine',
    '/users/availability/mine',
    '/users/userteams?userid=u1',
    '/tournament/mytournaments',
    '/tournament/csgoregsadmin',
    '/admin/users',
    '/account/userinfo'
  ])('does not cache %s', path => {
    expect(cached(`${api}${path}`)).toBe(false);
  });
});
