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
  map: CSGOMap;
  isPlayed: boolean;
  userId?: string;
  teamId?: string;
}

export interface CSGOActiveDutyDescriptor {
  id: CSGOMap;
  map: string;
  image: string;
  active: boolean;
  isPlayed: boolean;
  radar?: string [];
}

export const AllCSGOMaps: CSGOMapPool [] = [
  {
    map: CSGOMap.Cache,
    isPlayed: true
  },
  {
    map: CSGOMap.Dust2,
    isPlayed: true
  },
  {
    map: CSGOMap.Inferno,
    isPlayed: true
  },
  {
    map: CSGOMap.Mirage,
    isPlayed: true
  },
  {
    map: CSGOMap.Nuke,
    isPlayed: true
  },
  {
    map: CSGOMap.Overpass,
    isPlayed: true
  },
  {
    map: CSGOMap.Train,
    isPlayed: true
  },
  {
    map: CSGOMap.Vertigo,
    isPlayed: true
  },
  {
    map: CSGOMap.Cobblestone,
    isPlayed: true
  },
  {
    map: CSGOMap.Ancient,
    isPlayed: true
  }
];

export const ActiveDuty: CSGOActiveDutyDescriptor [] = [{
    id: CSGOMap.Cache,
    map: 'Cache',
    image: 'assets/csgo_maps/de_cache.jpg',
    radar: ['assets/csgo_map_radars/de_cache_radar.png'],
    active: false,
    isPlayed: false
  }, {
    id: CSGOMap.Dust2,
    map: 'Dust 2',
    image: 'assets/csgo_maps/de_dust2.jpg',
    radar: ['assets/csgo_map_radars/de_dust2_radar.png'],
    active: true,
    isPlayed: false
  }, {
    id: CSGOMap.Inferno,
    map: 'Inferno',
    image: 'assets/csgo_maps/de_inferno.jpg',
    radar: ['assets/csgo_map_radars/de_inferno_radar.png'],
    active: true,
    isPlayed: false
  }, {
    id: CSGOMap.Mirage,
    map: 'Mirage',
    image: 'assets/csgo_maps/de_mirage.jpg',
    radar: ['assets/csgo_map_radars/de_mirage_radar.png'],
    active: true,
    isPlayed: false
  }, {
    id: CSGOMap.Nuke,
    map: 'Nuke',
    image: 'assets/csgo_maps/de_nuke.jpg',
    radar: ['assets/csgo_map_radars/de_nuke_radar_combined.png'],
    active: true,
    isPlayed: false
  }, {
    id: CSGOMap.Overpass,
    map: 'Overpass',
    image: 'assets/csgo_maps/de_overpass.jpg',
    radar: ['assets/csgo_map_radars/de_overpass_radar.png'],
    active: true,
    isPlayed: false
  }, {
    id: CSGOMap.Train,
    map: 'Train',
    image: 'assets/csgo_maps/de_train.jpg',
    radar: ['assets/csgo_map_radars/de_train_radar.png'],
    active: false,
    isPlayed: false
  },
  {
    id: CSGOMap.Vertigo,
    map: 'Vertigo',
    image: 'assets/csgo_maps/de_vertigo.jpg',
    radar: ['assets/csgo_map_radars/de_vertigo_radar.png'],
    active: true,
    isPlayed: false
  },
  {
    id: CSGOMap.Cobblestone,
    map: 'Cobblestone',
    image: 'assets/csgo_maps/de_cbble.jpg',
    radar: ['assets/csgo_map_radars/de_cbble_radar.png'],
    active: false,
    isPlayed: false
  },
  {
    id: CSGOMap.Ancient,
    map: 'Ancient',
    image: 'assets/csgo_maps/de_ancient.webp',
    radar: ['assets/csgo_map_radars/de_cbble_radar.png'],
    active: true,
    isPlayed: false
  }
];
