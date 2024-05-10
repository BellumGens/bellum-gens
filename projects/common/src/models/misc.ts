import { PositionSettings, HorizontalAlignment, OverlaySettings, AutoPositionStrategy } from '@infragistics/igniteui-angular';

export const LOGIN_ASSETS = {
  Steam: '#101821',
  Twitch: '#6441a5',
  BattleNet: '#2d6ead'
};

const positionSettings: PositionSettings = {
  horizontalDirection: HorizontalAlignment.Left,
  horizontalStartPoint: HorizontalAlignment.Right
};

export const GLOBAL_OVERLAY_SETTINGS: OverlaySettings = {
  positionStrategy: new AutoPositionStrategy(positionSettings)
};

export const SameDay = (d1: Date, d2: Date): boolean => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();

export enum StratOrderBy {
  MostRecent,
  TopVoted
}

export const StratOrder = [
  { display: 'Most Recent', order: StratOrderBy.MostRecent },
  { display: 'Top Voted', order: StratOrderBy.TopVoted }
];

// export class CompetitionDefaults {
//   public static compStart = new Date(2021, 2, 24);
//   public static compFinals = new Date(2021, 4, 15);
//   public static regDeadline = new Date(2021, 8, 14);
// }

export const CREW_MEMBERS = [
  {
    name: 'Nikola "niku" Gyaurov',
    birthplace: 'Pazardzik, Bulgaria',
    position: 'CS:GO caster and host',
    image: '/assets/crew/niku.webp',
    twitter: 'https://twitter.com/OfficialNiku',
    facebook: 'https://www.facebook.com/nikutv/',
    instagram: 'https://www.instagram.com/officialniku/'
  },
  // {
  //   name: 'Georgy "lop" Tsanev',
  //   birthplace: 'Plovdiv, Bulgaria',
  //   position: 'CS:GO caster',
  //   image: '/assets/crew/lop.webp',
  //   twitter: 'https://twitter.com/Mighty_Lop',
  //   facebook: '',
  //   instagram: ''
  // },
  {
    name: 'Teodor "Tedd" Borisov',
    birthplace: 'Sofia, Bulgaria',
    position: 'CS:GO caster',
    image: '/assets/crew/tedcs.webp',
    twitter: 'https://twitter.com/teddcs',
    facebook: 'https://facebook.com/teddxd',
    instagram: 'https://instagram.com/teodorb1'
  },
  {
    name: 'Atanas "FURY" Popov',
    birthplace: 'Bansko, Bulgaria',
    position: 'CS:GO server admin',
    image: '/assets/crew/fury.webp',
    twitter: 'https://twitter.com/BProFURY',
    facebook: '',
    instagram: ''
  },
  {
    name: 'Petroslav "myth" Belchev',
    birthplace: 'Veliko Turnovo, Bulgaria',
    position: 'Motion graphics and video editing',
    image: '/assets/crew/myth.webp',
    twitter: 'https://twitter.com/mythvt',
    facebook: 'https://www.facebook.com/mythfilms/',
    instagram: 'https://www.instagram.com/mythvt/'
  },
  {
    name: 'Mihail "msrm" Mihailov',
    birthplace: 'Pernik, Bulgaria',
    position: 'StarCraft II caster',
    image: '/assets/crew/msrm.webp',
    twitter: 'https://twitter.com/The_msrm',
    facebook: '',
    instagram: ''
  },
  {
    name: 'Luchezar "exalted" Kamenov',
    birthplace: 'Sofia, Bulgaria',
    position: 'StarCraft II caster and host',
    image: '/assets/crew/exalted.webp',
    twitter: 'https://twitter.com/BSLesports',
    facebook: 'https://www.facebook.com/BSLesports/',
    instagram: 'https://www.instagram.com/bsl_esports/'
  }
];

export const CREW_MEMBERS_BG = [
  {
    name: 'Никола "niku" Гяуров',
    birthplace: 'Пазарджик',
    position: 'CS:GO кастър и Desk Host на финалите'
  },
  {
    name: 'Георги "lop" Цанев',
    birthplace: 'Пловдив',
    position: 'CS:GO кастър'
  },
  {
    name: 'Теодор "Tedd" Борисов',
    birthplace: 'София',
    position: 'CS:GO кастър'
  },
  {
    name: 'Атанас "fury" Попов',
    birthplace: 'Банско',
    position: 'CS:GO server admin'
  },
  {
    name: 'Петрослав "myth" Белчев',
    birthplace: 'Велико Търново',
    position: 'Motion graphics и видео едитор'
  },
  {
    name: 'Михаил "msrm" Михайлов',
    birthplace: 'Перник',
    position: 'StarCraft II кастър'
  },
  {
    name: 'Лъчезар "exalted" Каменов',
    birthplace: 'София',
    position: 'StarCraft II кастър и админ'
  }
];

