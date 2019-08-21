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
