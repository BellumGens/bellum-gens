export interface UtilityDescriptor {
  name: string;
  icon: string;
  fontSet: string;
  svg: string;
  width: number;
  height: number;
}

export interface EditorBrushColor {
  color: string;
  selected: boolean;
}

export const StratUtilities: UtilityDescriptor [] = [
  {
    name: 'Flash',
    icon: 'flashbang',
    fontSet: 'weapon-icons',
    width: 72,
    height: 72,
    svg: '/assets/editor/flashbang.png'
  },
  {
    name: 'Smoke',
    icon: 'smoke',
    fontSet: 'weapon-icons',
    width: 72,
    height: 72,
    svg: '/assets/editor/smoke-nade.png'
  },
  {
    name: 'Molotov',
    icon: 'molotov',
    fontSet: 'weapon-icons',
    width: 72,
    height: 72,
    svg: '/assets/editor/molotov.png'
  },
  {
    name: 'HE Grenade',
    icon: 'hegrenade',
    fontSet: 'weapon-icons',
    width: 72,
    height: 72,
    svg: '/assets/editor/he-nade.png'
  },
  {
    name: 'C4',
    icon: 'c4',
    fontSet: 'weapon-icons',
    width: 30,
    height: 30,
    svg: '/assets/weapon-icons/svg_normal/weapon_c4.svg'
  }
];

export const EditorBrushColors: EditorBrushColor [] = [
  { color: 'red', selected: true },
  { color: '#cbb87d', selected: false },
  { color: '#b2c9de', selected: false },
  { color: '#647e95', selected: false },
  { color: 'green', selected: false }
];
