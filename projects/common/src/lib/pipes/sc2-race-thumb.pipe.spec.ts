import { Sc2RaceThumbPipe } from './sc2-race-thumb.pipe';

describe('Sc2RaceThumbPipe', () => {
  let pipe: Sc2RaceThumbPipe;

  beforeEach(() => {
    pipe = new Sc2RaceThumbPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform "terran" to "assets/bge/race/terran.png"', () => {
    const result = pipe.transform('terran');
    expect(result).toBe('assets/bge/race/terran.png');
  });

  it('should transform "zerg" to "assets/bge/race/zerg.png"', () => {
    const result = pipe.transform('zerg');
    expect(result).toBe('assets/bge/race/zerg.png');
  });

  it('should transform "protoss" to "assets/bge/race/protoss.png"', () => {
    const result = pipe.transform('protoss');
    expect(result).toBe('assets/bge/race/protoss.png');
  });

  it('should transform "Terran" to "assets/bge/race/terran.png" (case insensitive)', () => {
    const result = pipe.transform('Terran');
    expect(result).toBe('assets/bge/race/terran.png');
  });

  it('should transform "Zerg" to "assets/bge/race/zerg.png" (case insensitive)', () => {
    const result = pipe.transform('Zerg');
    expect(result).toBe('assets/bge/race/zerg.png');
  });

  it('should transform "Protoss" to "assets/bge/race/protoss.png" (case insensitive)', () => {
    const result = pipe.transform('Protoss');
    expect(result).toBe('assets/bge/race/protoss.png');
  });

  it('should transform an unknown race to "assets/bge/race/unknown.png"', () => {
    const result = pipe.transform('unknown');
    expect(result).toBe('assets/bge/race/unknown.png');
  });
});
