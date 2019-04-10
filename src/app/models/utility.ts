export interface UtilityDescriptor {
  name: string;
  icon: string;
  fontSet: string;
  svg: string;
}

export const StratUtilities: UtilityDescriptor [] = [
  {
    name: 'Flash',
    icon: 'flashbang',
    fontSet: 'weapon-icons',
    svg: '/assets/weapon-icons/svg_normal/weapon_flashbang.svg'
  },
  {
    name: 'Smoke',
    icon: 'smoke',
    fontSet: 'weapon-icons',
    svg: '/assets/weapon-icons/svg_normal/weapon_smokegrenade.svg'
  },
  {
    name: 'Molotov',
    icon: 'molotov',
    fontSet: 'weapon-icons',
    svg: '/assets/weapon-icons/svg_normal/weapon_molotov.svg'
  }
];
