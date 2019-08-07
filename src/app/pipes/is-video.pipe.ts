import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isVideo'
})
export class IsVideoPipe implements PipeTransform {
  public static _youtubeRegEx = /(youtu\.be\/|youtube\.com\/(watch\?(.*&)?v=|(embed|v)\/))([^\?&"'>]+)/;
  public static _twitchRegEx = /(twitch\.tv\/)(videos\/|\?[^\?"'>]+video\=v)([^\?&"'>]+)/;

  public static isYoutube(url: string) {
    return this._youtubeRegEx.test(url);
  }

  public static isTwitch(url: string) {
    return this._twitchRegEx.test(url);
  }

  transform(url: string): any {
    return IsVideoPipe.isYoutube(url) || IsVideoPipe.isTwitch(url);
  }

}
