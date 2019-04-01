export interface MapPool {
  Map: CSGOMap;
  IsPlayed: boolean;
  UserId: string;
  TeamId: string;
}

export interface ActiveDutyDescriptor {
  id: CSGOMap;
  map: string;
  image: string;
  active: boolean;
}

export enum CSGOMap {
  Cache,
  Dust2,
  Inferno,
  Mirage,
  Nuke,
  Overpass,
  Train,
  Vertigo,
  Cobblestone
}

export const ActiveDuty: ActiveDutyDescriptor [] = [
  { id: CSGOMap.Cache, map: 'Cache', image: 'assets/csgo_maps/de_cache.jpg', active: false },
  { id: CSGOMap.Dust2, map: 'Dust 2', image: 'assets/csgo_maps/de_dust2.jpg', active: true },
  { id: CSGOMap.Inferno, map: 'Inferno', image: 'assets/csgo_maps/de_inferno.jpg', active: true },
  { id: CSGOMap.Mirage, map: 'Mirage', image: 'assets/csgo_maps/de_mirage.jpg', active: true },
  { id: CSGOMap.Nuke, map: 'Nuke', image: 'assets/csgo_maps/de_nuke.jpg', active: true },
  { id: CSGOMap.Overpass, map: 'Overpass', image: 'assets/csgo_maps/de_overpass.jpg', active: true },
  { id: CSGOMap.Train, map: 'Train', image: 'assets/csgo_maps/de_train.jpg', active: true },
  { id: CSGOMap.Vertigo, map: 'Vertigo', image: 'assets/csgo_maps/de_vertigo.jpg', active: true },
  { id: CSGOMap.Cobblestone, map: 'Cobblestone', image: 'assets/csgo_maps/de_cbble.jpg', active: false }
];
