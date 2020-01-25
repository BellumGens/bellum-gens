import { PositionSettings, HorizontalAlignment, OverlaySettings, AutoPositionStrategy } from 'igniteui-angular';

export const LOGIN_ASSETS = {
  Steam: '#101821',
  Twitch: '#6441a5'
};

const positionSettings: PositionSettings = {
  horizontalDirection: HorizontalAlignment.Left,
  horizontalStartPoint: HorizontalAlignment.Right
};

export const GlobalOverlaySettings: OverlaySettings = {
  positionStrategy: new AutoPositionStrategy(positionSettings)
};

export enum StratOrderBy {
  MostRecent,
  TopVoted
}

export const StratOrder = [
  { display: 'Most Recent', order: StratOrderBy.MostRecent },
  { display: 'Top Voted', order: StratOrderBy.TopVoted }
];

export const CREW_MEMBERS = [
  {
    name: 'Никола "niku" Гяуров',
    birthplace: 'Пазарджик',
    position: 'CS:GO кастър',
    // tslint:disable-next-line:max-line-length
    description: 'Никола "niku" Гяуров започва да се занимава с Counter-Strike франчайза през 2003-та година, когато е само на 12 години. За жалост електронните спортове по онова време не бяха толкова развити, както са сега, но пък хората са казали, че формата е временна, а класата е вечна. В днешно време той коментира едни от най-големите CS:GO турнири, като IEM Katowice Major 2019, ESL One New York и още много други, на български език.',
    image: '/assets/crew/niku.webp',
    twitter: 'https://twitter.com/OfficialNiku',
    facebook: 'https://www.facebook.com/nikutv/',
    instagram: 'https://www.instagram.com/officialniku/'
  },
  {
    name: 'Георги "lop" Цанев',
    birthplace: 'Пловдив',
    position: 'CS:GO кастър',
    // tslint:disable-next-line:max-line-length
    description: 'Counter-Strike вече повече от 20 години е неразделна част от животa na Георги "lop" Цанев! Ето и част от турнирите, които e коментирал: ESL Pro League, IEM Shanghai, ESL One Cologne, ESL One New York, IEM Chicago, IEM Katowice',
    image: '/assets/crew/lop.webp',
    twitter: 'https://twitter.com/Mighty_Lop',
    facebook: '',
    instagram: ''
  },
  {
    name: 'Атанас "fury" Попов',
    birthplace: 'Банско',
    position: 'CS:GO server admin',
    // tslint:disable-next-line:max-line-length
    description: 'Атанас е студент и мениджър в BProGaming. Ангажиран е със света на гейминга от 15 години. Отделя повече време последните 5 години и гледа на заниманието с игри, като на всеки друг спорт.',
    image: '/assets/crew/fury.webp',
    twitter: 'https://twitter.com/BProFURY',
    facebook: '',
    instagram: ''
  },
  {
    name: 'Петрослав "myth" Белчев',
    birthplace: 'Велико Търново',
    position: 'Motion graphics и видео едитор',
    // tslint:disable-next-line:max-line-length
    description: 'Петрослав или по-познат като Myth в гейминг средите е едно от разпознаваемите лица в родната сцена с над 14 годишен опит в сферата на видео монтажа. В портфолиото му стоят проекти от периода му в iNNERFIRE, SK GAMING, както и AFKtv и Gplay TV с които е  организирал едни от най-големите гейм събития правени в България.',
    image: '/assets/crew/myth.webp',
    twitter: 'https://twitter.com/mythvt',
    facebook: 'https://www.facebook.com/mythfilms/',
    instagram: 'https://www.instagram.com/mythvt/'
  },
  {
    name: 'Михаил "msrm" Михайлов',
    birthplace: 'Перник',
    position: 'StarCraft II кастър',
    // tslint:disable-next-line:max-line-length
    description: 'Най-много участия в Български LAN турнири по StarCraft 2 в последните 6 години. Единственият българин, класирал се за "premier" ниво турнир в последните 6 години (Top48 на WESG 2018). Играе Zerg. Играч и коментатор на Българската СтарКрафт Лига.',
    image: '/assets/crew/msrm.webp',
    twitter: 'https://twitter.com/The_msrm',
    facebook: '',
    instagram: ''
  },
  {
    name: 'Лъчезар "exalted" Каменов',
    birthplace: 'София',
    position: 'StarCraft II кастър и админ',
    // tslint:disable-next-line:max-line-length
    description: 'Лъчезар Димитров Каменов, на 26 години, е създател на първата по рода си лига по StarCraft в България - Българската СтарКрафт Лига. Освен страстен привърженик на електронните спортове, той е и активен участник в развитието на индустрията в България, амбициран да предостави най-добрите условия, на които да се наслаждават и играчи, и фенове.',
    image: '/assets/crew/exalted.webp',
    twitter: 'https://twitter.com/BSLesports',
    facebook: 'https://www.facebook.com/BSLesports/',
    instagram: 'https://www.instagram.com/bsl_esports/'
  }
];
