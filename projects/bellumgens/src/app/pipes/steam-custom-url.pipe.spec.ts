import { SteamCustomUrlPipe } from './steam-custom-url.pipe';
import { SteamUser } from '../../../../common/src/public_api';

describe('SteamCustomUrlPipe', () => {
  const pipe = new SteamCustomUrlPipe();

  it('links to the custom profile URL when the user has one', () => {
    expect(pipe.transform({ customURL: 'kdinev', steamID64: '7656' } as SteamUser)).toBe('https://steamcommunity.com/id/kdinev');
  });

  it('falls back to the profile id', () => {
    expect(pipe.transform({ customURL: '', steamID64: '7656' } as SteamUser)).toBe('https://steamcommunity.com/profiles/7656');
  });

  it('has no link without a user or an id', () => {
    expect(pipe.transform(null)).toBeNull();
    expect(pipe.transform({ customURL: '', steamID64: '' } as SteamUser)).toBeNull();
  });
});
