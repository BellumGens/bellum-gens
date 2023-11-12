import { ActiveDutyMapsPipe } from './active-duty-maps.pipe';
import { CSGOActiveDutyMap, CSGOMap, CSGOMapPool } from '../../public_api';

describe('ActiveDutyMapsPipe', () => {
  let pipe: ActiveDutyMapsPipe;

  beforeEach(() => {
    pipe = new ActiveDutyMapsPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return all maps when viewAll is true', () => {
    const maps: CSGOMapPool[] = [
      { mapId: CSGOMap.Dust2, active: true, isPlayed: true },
      { mapId: CSGOMap.Mirage, active: true, isPlayed: true },
      { mapId: CSGOMap.Inferno, active: true, isPlayed: true },
      { mapId: CSGOMap.Overpass, active: true, isPlayed: true },
      { mapId: CSGOMap.Train, active: false, isPlayed: true },
      { mapId: CSGOMap.Nuke, active: true, isPlayed: true },
      { mapId: CSGOMap.Vertigo, active: true, isPlayed: true },
      { mapId: CSGOMap.Ancient, active: true, isPlayed: true },
    ];
    expect(pipe.transform(maps as CSGOActiveDutyMap [], true)).toEqual(maps as CSGOActiveDutyMap []);
  });

  it('should return only active duty maps when viewAll is false', () => {
    const maps: CSGOMapPool[] = [
      { mapId: CSGOMap.Dust2, active: true, isPlayed: true },
      { mapId: CSGOMap.Mirage, active: true, isPlayed: true },
      { mapId: CSGOMap.Inferno, active: true, isPlayed: true },
      { mapId: CSGOMap.Overpass, active: true, isPlayed: true },
      { mapId: CSGOMap.Train, active: true, isPlayed: true },
      { mapId: CSGOMap.Nuke, active: false, isPlayed: true },
      { mapId: CSGOMap.Vertigo, active: false, isPlayed: true },
      { mapId: CSGOMap.Ancient, active: false, isPlayed: true },
    ];
    const expected: CSGOMapPool[] = [
      { mapId: CSGOMap.Dust2, active: true, isPlayed: true },
      { mapId: CSGOMap.Mirage, active: true, isPlayed: true },
      { mapId: CSGOMap.Inferno, active: true, isPlayed: true },
      { mapId: CSGOMap.Overpass, active: true, isPlayed: true },
      { mapId: CSGOMap.Train, active: true, isPlayed: true },
    ];
    expect(pipe.transform(maps as CSGOActiveDutyMap [], false)).toEqual(expected as CSGOActiveDutyMap []);
  });

  it('should return empty array when maps is null or undefined', () => {
    expect(pipe.transform(null, true)).toEqual([]);
    expect(pipe.transform(undefined, true)).toEqual([]);
  });

  it('should return empty array when maps is empty', () => {
    expect(pipe.transform([], true)).toEqual([]);
  });
});
