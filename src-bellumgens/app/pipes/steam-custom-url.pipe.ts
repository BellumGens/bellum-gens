import { Pipe, PipeTransform } from '@angular/core';
import { SteamUser } from '../../../src-common/models/steamuser';

@Pipe({
  name: 'steamCustomUrl'
})
export class SteamCustomUrlPipe implements PipeTransform {

  public transform(user: SteamUser): string {
    if (user && user.customURL) {
      return `https://steamcommunity.com/id/${user.customURL}`;
    } else if (user && user.steamID64) {
      return `https://steamcommunity.com/profiles/${user.steamID64}`;
    }
    return null;
  }

}
