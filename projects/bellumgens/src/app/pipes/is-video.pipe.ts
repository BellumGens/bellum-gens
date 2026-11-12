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

  public static getYoutubeEmbedLink(url: string): string {
    const parts = this._youtubeRegEx.exec(url);
    return parts ? `https://www.youtube.com/embed/${parts[5]}` : '';
  }

  public static getTwitchEmbedLink(url: string): string {
    const parts = this._twitchRegEx.exec(url);
    return parts ? `https://player.twitch.tv/?autoplay=false&video=v${parts[3]}` : '';
  }

  public transform(url: string): boolean {
    return IsVideoPipe.isYoutube(url) || IsVideoPipe.isTwitch(url);
  }

}
