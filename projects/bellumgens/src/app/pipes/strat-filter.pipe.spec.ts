import { CSGOMap, CSGOStrategy } from 'dist/common/public_api';
import { StratFilterPipe } from './strat-filter.pipe';

describe('StratFilterPipe', () => {
  const testStrats: CSGOStrategy [] = [{
    id: '1',
    teamId: '1',
    side: 0,
    title: 'Strat 1',
    description: 'Strat 1',
    url: '',
    map: CSGOMap.Cache
  }, {
    id: '2',
    teamId: '2',
    side: 0,
    title: 'Strat 2',
    description: 'Strat 2',
    url: '',
    map: CSGOMap.Nuke
  }];

  it('create an instance', () => {
    const pipe = new StratFilterPipe();
    expect(pipe).toBeTruthy();
    let result = pipe.transform(testStrats, true);
    expect(result).toEqual(testStrats);
    result = pipe.transform(testStrats, false);
    expect(result).toEqual(testStrats.slice(1));
    result = pipe.transform(null, true);
    expect(result).toBeNull();
  });
});
