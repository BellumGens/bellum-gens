export interface UtilityDescriptor {
  name: string;
  icon: string;
  fontSet: string;
  svg: string;
  width: number;
  height: number;
}

export const StratUtilities: UtilityDescriptor [] = [
  {
    name: 'Flash',
    icon: 'flashbang',
    fontSet: 'weapon-icons',
    width: 15,
    height: 30,
    svg: '/assets/weapon-icons/svg_normal/weapon_flashbang.svg'
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
    width: 21,
    height: 30,
    svg: '/assets/weapon-icons/svg_normal/weapon_molotov.svg'
  },
  {
    name: 'HE Grenade',
    icon: 'hegrenade',
    fontSet: 'weapon-icons',
    width: 21,
    height: 30,
    svg: '/assets/weapon-icons/svg_normal/weapon_hegrenade.svg'
  }
];
