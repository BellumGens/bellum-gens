import { StartsWithPipe } from './starts-with.pipe';

describe('StartsWithPipe', () => {
  it('create an instance', () => {
    const pipe = new StartsWithPipe();
    expect(pipe).toBeTruthy();
  });

  it('should keep the items starting with the term, ignoring case', () => {
    const pipe = new StartsWithPipe();
    expect(pipe.transform(['ACME', 'Apex', 'Bellum'], 'a')).toEqual(['ACME', 'Apex']);
    expect(pipe.transform(['ACME', 'Apex', 'Bellum'], 'BEL')).toEqual(['Bellum']);
  });

  it('should keep all items when there is no term', () => {
    const pipe = new StartsWithPipe();
    const teams = ['ACME', 'Apex', 'Bellum'];
    expect(pipe.transform(teams)).toEqual(teams);
    expect(pipe.transform(teams, undefined)).toEqual(teams);
    expect(pipe.transform(teams, '')).toEqual(teams);
  });

  it('should keep all items when the term is null', () => {
    const pipe = new StartsWithPipe();
    const teams = ['ACME', 'Apex', 'Bellum'];
    expect(pipe.transform(teams, null)).toEqual(teams);
  });

  it('should return a missing collection as is', () => {
    const pipe = new StartsWithPipe();
    expect(pipe.transform(null, 'a')).toBeNull();
    expect(pipe.transform(undefined, 'a')).toBeUndefined();
  });
});
