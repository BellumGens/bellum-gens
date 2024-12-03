export enum SC2Map {
  TritonLE,
  EphemeronLE,
  WorldofSleepersLE,
  ZenLE,
  SimulacrumLE,
  NightshadeLE,
  EternalEmpireLE,
  GoldenWallLE,
  PurityAndIndustryLE,
  EverDreamLE,
  SubmarineLE,
  DeathauraLE,
  PillarsofGoldLE,
  OxideLE,
  LightshadeLE,
  RomanticideLE,
  JagannathaLE,
  IceAndChromeLE,
  AlcyoneLE,
  AmphionLE,
  CrimsonCourtLE,
  DynastyLE,
  GhostRiverLE,
  GoldenauraLE,
  OceanbornLE,
  PostYouthLE,
  SiteDeltaLE,
  AbyssalReefLE,
  AmygdalaLE,
  ElDoradoLE,
  FrostlineLE,
  KingsCoveLE,
  LeyLinesLE,
  NeonVioletSquareLE,
  UltraloveLE,
  WhispersofGoldLE
}

export interface SC2LadderMap {
  id: SC2Map;
  map: string;
  image?: string;
  active?: boolean;
}

export const SC2_MAPS: SC2LadderMap [] = [{
    id: SC2Map.TritonLE,
    map: 'Triton LE'
  }, {
    id: SC2Map.EphemeronLE,
    map: 'Ephemeron LE'
  }, {
    id: SC2Map.WorldofSleepersLE,
    map: 'World of Sleepers LE'
  }, {
    id: SC2Map.ZenLE,
    map: 'Zen LE'
  }, {
    id: SC2Map.SimulacrumLE,
    map: 'Simulacrum LE'
  }, {
    id: SC2Map.NightshadeLE,
    map: 'Nightshade LE'
  }, {
    id: SC2Map.EternalEmpireLE,
    map: 'Eternal Empire LE'
  }, {
    id: SC2Map.GoldenWallLE,
    map: 'Golden Wall LE'
  }, {
    id: SC2Map.PurityAndIndustryLE,
    map: 'Purity and Industry LE'
  }, {
    id: SC2Map.EverDreamLE,
    map: 'Ever Dream LE'
  }, {
    id: SC2Map.SubmarineLE,
    map: 'Submarine LE'
  }, {
    id: SC2Map.DeathauraLE,
    map: 'Deathaura LE'
  }, {
    id: SC2Map.PillarsofGoldLE,
    map: 'Pillars of Gold LE'
  }, {
    id: SC2Map.OxideLE,
    map: 'Oxide LE'
  }, {
    id: SC2Map.LightshadeLE,
    map: 'Lightshade LE'
  }, {
    id: SC2Map.RomanticideLE,
    map: 'Romanticide LE'
  }, {
    id: SC2Map.JagannathaLE,
    map: 'Jagannatha LE'
  }, {
    id: SC2Map.IceAndChromeLE,
    map: 'Ice and Chrome LE'
  }, {
    id: SC2Map.AlcyoneLE,
    map: 'Alcyone LE'
  }, {
    id: SC2Map.AmphionLE,
    map: 'Amphion LE'
  }, {
    id: SC2Map.CrimsonCourtLE,
    map: 'Crimson Court LE'
  }, {
    id: SC2Map.DynastyLE,
    map: 'Dynasty LE'
  }, {
    id: SC2Map.GhostRiverLE,
    map: 'Ghost River LE'
  }, {
    id: SC2Map.GoldenauraLE,
    map: 'Goldenaura LE'
  }, {
    id: SC2Map.OceanbornLE,
    map: 'Oceanborn LE'
  }, {
    id: SC2Map.PostYouthLE,
    map: 'Post-Youth LE'
  }, {
    id: SC2Map.SiteDeltaLE,
    map: 'Site Delta LE'
  }, {
    id: SC2Map.AbyssalReefLE,
    map: 'Abyssal Reef LE'
  }, {
    id: SC2Map.AmygdalaLE,
    map: 'Amygdala LE'
  }, {
    id: SC2Map.ElDoradoLE,
    map: 'El Dorado LE'
  }, {
    id: SC2Map.FrostlineLE,
    map: 'Frostline LE'
  }, {
    id: SC2Map.KingsCoveLE,
    map: 'King\'s Cove LE'
  }, {
    id: SC2Map.LeyLinesLE,
    map: 'Ley Lines LE'
  }, {
    id: SC2Map.NeonVioletSquareLE,
    map: 'Neon Violet Square LE'
  }, {
    id: SC2Map.UltraloveLE,
    map: 'Ultralove LE'
  }, {
    id: SC2Map.WhispersofGoldLE,
    map: 'Whispers of Gold LE'
  }
];
