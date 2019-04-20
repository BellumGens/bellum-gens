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
  radar?: string [];
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

export const ActiveDuty: ActiveDutyDescriptor [] = [{
    id: CSGOMap.Cache,
    map: 'Cache',
    image: 'assets/csgo_maps/de_cache.jpg',
    radar: ['assets/csgo_map_radars/de_cache_radar.png'],
    active: false
  }, {
    id: CSGOMap.Dust2,
    map: 'Dust 2',
    image: 'assets/csgo_maps/de_dust2.jpg',
    radar: ['assets/csgo_map_radars/de_dust2_radar.png'],
    active: true
  }, {
    id: CSGOMap.Inferno,
    map: 'Inferno',
    image: 'assets/csgo_maps/de_inferno.jpg',
    radar: ['assets/csgo_map_radars/de_inferno_radar.png'],
    active: true
  }, {
    id: CSGOMap.Mirage,
    map: 'Mirage',
    image: 'assets/csgo_maps/de_mirage.jpg',
    radar: ['assets/csgo_map_radars/de_mirage_radar.png'],
    active: true
  }, {
    id: CSGOMap.Nuke,
    map: 'Nuke',
    image: 'assets/csgo_maps/de_nuke.jpg',
    radar: ['assets/csgo_map_radars/de_nuke_radar.png', 'assets/csgo_map_radars/de_nuke_lower_radar.png'],
    active: true
  }, {
    id: CSGOMap.Overpass,
    map: 'Overpass',
    image: 'assets/csgo_maps/de_overpass.jpg',
    radar: ['assets/csgo_map_radars/de_overpass_radar.png'],
    active: true
  }, {
    id: CSGOMap.Train,
    map: 'Train',
    image: 'assets/csgo_maps/de_train.jpg',
    radar: ['assets/csgo_map_radars/de_train_radar.png'],
    active: true
  },
  { id: CSGOMap.Vertigo, map: 'Vertigo', image: 'assets/csgo_maps/de_vertigo.jpg', active: true },
  { id: CSGOMap.Cobblestone, map: 'Cobblestone', image: 'assets/csgo_maps/de_cbble.jpg', active: false }
];
