export enum CSGOMap {
  Cache,
  Dust2,
  Inferno,
  Mirage,
  Nuke,
  Overpass,
  Train,
  Vertigo,
  Cobblestone,
  Ancient
}

export interface CSGOMapPool {
  mapId: CSGOMap;
  isPlayed: boolean;
  active?: boolean;
  userId?: string;
  teamId?: string;
}

export interface CSGOActiveDutyDescriptor extends CSGOMapPool {
  map: string;
  image: string;
  radar?: string [];
}

export const AllCSGOMaps: CSGOMapPool [] = [
  {
    mapId: CSGOMap.Cache,
    isPlayed: true,
    active: false
  },
  {
    mapId: CSGOMap.Dust2,
    isPlayed: true,
    active: true
  },
  {
    mapId: CSGOMap.Inferno,
    isPlayed: true,
    active: true
  },
  {
    mapId: CSGOMap.Mirage,
    isPlayed: true,
    active: true
  },
  {
    mapId: CSGOMap.Nuke,
    isPlayed: true,
    active: true
  },
  {
    mapId: CSGOMap.Overpass,
    isPlayed: true,
    active: true
  },
  {
    mapId: CSGOMap.Train,
    isPlayed: true,
    active: false
  },
  {
    mapId: CSGOMap.Vertigo,
    isPlayed: true,
    active: true
  },
  {
    mapId: CSGOMap.Cobblestone,
    isPlayed: true,
    active: false
  },
  {
    mapId: CSGOMap.Ancient,
    isPlayed: true,
    active: true
  }
];

export const ACTIVE_DUTY: CSGOActiveDutyDescriptor [] = [{
    mapId: CSGOMap.Cache,
    map: 'Cache',
    image: 'assets/csgo_maps/de_cache.jpg',
    radar: ['assets/csgo_map_radars/de_cache_radar.png'],
    active: false,
    isPlayed: false
  }, {
    mapId: CSGOMap.Dust2,
    map: 'Dust 2',
    image: 'assets/csgo_maps/de_dust2.jpg',
    radar: ['assets/csgo_map_radars/de_dust2_radar.png'],
    active: true,
    isPlayed: false
  }, {
    mapId: CSGOMap.Inferno,
    map: 'Inferno',
    image: 'assets/csgo_maps/de_inferno.jpg',
    radar: ['assets/csgo_map_radars/de_inferno_radar.png'],
    active: true,
    isPlayed: false
  }, {
    mapId: CSGOMap.Mirage,
    map: 'Mirage',
    image: 'assets/csgo_maps/de_mirage.jpg',
    radar: ['assets/csgo_map_radars/de_mirage_radar.png'],
    active: true,
    isPlayed: false
  }, {
    mapId: CSGOMap.Nuke,
    map: 'Nuke',
    image: 'assets/csgo_maps/de_nuke.jpg',
    radar: ['assets/csgo_map_radars/de_nuke_radar_combined.png'],
    active: true,
    isPlayed: false
  }, {
    mapId: CSGOMap.Overpass,
    map: 'Overpass',
    image: 'assets/csgo_maps/de_overpass.jpg',
    radar: ['assets/csgo_map_radars/de_overpass_radar.png'],
    active: true,
    isPlayed: false
  }, {
    mapId: CSGOMap.Train,
    map: 'Train',
    image: 'assets/csgo_maps/de_train.jpg',
    radar: ['assets/csgo_map_radars/de_train_radar.png'],
    active: false,
    isPlayed: false
  },
  {
    mapId: CSGOMap.Vertigo,
    map: 'Vertigo',
    image: 'assets/csgo_maps/de_vertigo.jpg',
    radar: ['assets/csgo_map_radars/de_vertigo_radar.png'],
    active: true,
    isPlayed: false
  },
  {
    mapId: CSGOMap.Cobblestone,
    map: 'Cobblestone',
    image: 'assets/csgo_maps/de_cbble.jpg',
    radar: ['assets/csgo_map_radars/de_cbble_radar.png'],
    active: false,
    isPlayed: false
  },
  {
    mapId: CSGOMap.Ancient,
    map: 'Ancient',
    image: 'assets/csgo_maps/de_ancient.webp',
    radar: ['assets/csgo_map_radars/de_cbble_radar.png'],
    active: true,
    isPlayed: false
  }
];
