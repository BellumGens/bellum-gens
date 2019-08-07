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
