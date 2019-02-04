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
  Train
}

export const ActiveDuty: ActiveDutyDescriptor [] = [
  { id: 0, map: 'Cache', image: 'assets/csgo_maps/CSGO_Cache_A_site.jpg', active: true },
  { id: 1, map: 'Dust 2', image: 'assets/csgo_maps/320px-Csgo_dust2.0.jpg', active: true },
  { id: 2, map: 'Inferno', image: 'assets/csgo_maps/320px-De_new_inferno.jpg', active: true },
  { id: 3, map: 'Mirage', image: 'assets/csgo_maps/320px-Csgo_mirage.jpg', active: true },
  { id: 4, map: 'Nuke', image: 'assets/csgo_maps/320px-Nuke_csgo.jpg', active: true },
  { id: 5, map: 'Overpass', image: 'assets/csgo_maps/320px-Csgo_overpass.jpg', active: true },
  { id: 6, map: 'Train', image: 'assets/csgo_maps/320px-Train_csgo.jpg', active: true }
];
