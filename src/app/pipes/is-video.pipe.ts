import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isVideo'
})
export class IsVideoPipe implements PipeTransform {
  private _youtubeRegEx = /(youtu\.be\/|youtube\.com\/(watch\?(.*&)?v=|(embed|v)\/))([^\?&"'>]+)/;
  private _twitchRegEx = /(twitch\.tv\/)(videos\/|\?[^\?"'>]+video\=v)([^\?&"'>]+)/;

  transform(url: string): any {
    return this.isYoutube(url) || this.isTwitch(url);
  }

  public isYoutube(url: string) {
    return this._youtubeRegEx.test(url);
  }

  public isTwitch(url: string) {
    return this._twitchRegEx.test(url);
  }

}
