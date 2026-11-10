import { RaceIconPipe } from './race-icon.pipe';
import { SC2Race } from 'bellum-gens-common/models';

describe('RaceIconPipe', () => {
  let pipe: RaceIconPipe;

  beforeEach(() => {
    pipe = new RaceIconPipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the correct icon for Protoss', () => {
    const result = pipe.transform(SC2Race.Protoss);
    expect(result).toBe('assets/bge/race/protoss.png');
  });

  it('should return the correct icon for Terran', () => {
    const result = pipe.transform(SC2Race.Terran);
    expect(result).toBe('assets/bge/race/terran.png');
  });

  it('should return the correct icon for Zerg', () => {
    const result = pipe.transform(SC2Race.Zerg);
    expect(result).toBe('assets/bge/race/zerg.png');
  });

  it('should return an empty string for an invalid race', () => {
    const result = pipe.transform(null);
    expect(result).toBe('');
  });

  it('should return an empty string for undefined', () => {
    const result = pipe.transform(undefined);
    expect(result).toBe('');
  });
});
