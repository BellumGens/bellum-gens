import { QueryParsedPipe } from './query-parsed.pipe';
import { PlaystyleRole } from '../../../../common/src/public_api';

describe('QueryParsedPipe', () => {
  const pipe = new QueryParsedPipe();

  it('describes a team search', () => {
    expect(pipe.transform(`role=${PlaystyleRole.Awper}&overlap=3&name=bellum`))
      .toBe(` looking for Awper with availability overlap of at least 3 hours with name containing 'bellum'`);
  });

  it('describes a player search', () => {
    expect(pipe.transform(`role=${PlaystyleRole.IGL}&overlap=2&name=kd`, true))
      .toBe(` playing as IGL with availability overlap of at least 2 hours with name containing 'kd'`);
  });

  it('ignores the criteria that were left empty', () => {
    expect(pipe.transform('role=null&overlap=0&name=')).toBe(' with no search criteria');
    expect(pipe.transform('role=null&overlap=0&name=', true)).toBe(' with no search criteria');
  });

  it('has no criteria without a query', () => {
    expect(pipe.transform('')).toBe(' with no search criteria');
    expect(pipe.transform(null, true)).toBe(' with no search criteria');
  });
});
