export interface UtilityDescriptor {
  name: string;
  icon: string;
  family: string;
  svg: string;
  width: number;
  height: number;
}

export interface EditorBrushColor {
  color: string;
  selected: boolean;
}

export const STRAT_UTILITIES: UtilityDescriptor [] = [
  {
    name: 'Flash',
    icon: 'flashbang',
    family: 'weapon-icons',
    width: 72,
    height: 72,
    svg: '/assets/editor/flashbang.png'
  },
  {
    name: 'Smoke',
    icon: 'smoke',
    family: 'weapon-icons',
    width: 72,
    height: 72,
    svg: '/assets/editor/smoke-nade.png'
  },
  {
    name: 'Molotov',
    icon: 'molotov',
    family: 'weapon-icons',
    width: 72,
    height: 72,
    svg: '/assets/editor/molotov.png'
  },
  {
    name: 'HE Grenade',
    icon: 'hegrenade',
    family: 'weapon-icons',
    width: 72,
    height: 72,
    svg: '/assets/editor/he-nade.png'
  },
  {
    name: 'C4',
    icon: 'c4',
    family: 'weapon-icons',
    width: 30,
    height: 30,
    svg: '/assets/weapon-icons/svg_normal/weapon_c4.svg'
  }
];

export const EDITOR_BRUSH_COLORS: EditorBrushColor [] = [
  { color: '#fff100', selected: true },
  { color: '#5889ff', selected: false },
  { color: '#ff282d', selected: false },
  { color: '#00ee65', selected: false },
  { color: '#ff63cd', selected: false }
];
