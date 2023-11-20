import { ACTIVE_DUTY, CSGOMap } from '../../public_api';
import { CSGOMapimagePipe } from './csgomapimage.pipe';


describe('CSGOMapimagePipe', () => {
  let pipe: CSGOMapimagePipe;

  beforeEach(() => {
    pipe = new CSGOMapimagePipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return the correct image path for Active Duty maps', () => {
    const map = CSGOMap.Inferno;
    const result = pipe.transform(map);
    expect(result).toBe(ACTIVE_DUTY.find(m => m.map === 'Inferno').image);
  });

  it('should return the correct image path for non-Active Duty maps', () => {
    const map = CSGOMap.Dust2
    const result = pipe.transform(map);
    expect(result).toBe(ACTIVE_DUTY.find(m => m.map === 'Dust 2').image);
  });

  it('should return an empty string if the map is undefined', () => {
    const result = pipe.transform(undefined);
    expect(result).toBe('');
  });
});
