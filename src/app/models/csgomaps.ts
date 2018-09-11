export interface MapPool {
  Map: CSGOMap;
  IsPlayed: boolean;
}

export enum CSGOMap {
  Cache,
  Dust2,
  Inferno,
  Mirage,
  Nuke,
  Overpass,
  Train
}
