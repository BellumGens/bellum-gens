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
    image: '/assets/crew/niku.jpg'
  },
  {
    name: 'Георги "lop" Цанев',
    birthplace: 'Пловдив',
    position: 'CS:GO кастър',
    // tslint:disable-next-line:max-line-length
    description: 'Counter-Strike вече повече от 20 години е неразделна част от животa na Георги "lop" Цанев! Тя е динамична, интересна и средство за създаване на приятелства!',
    image: '/assets/crew/lop.jpg'
  }
];
