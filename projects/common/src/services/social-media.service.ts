import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SocialMediaService {

  protected _twitterShare = 'https://twitter.com/intent/tweet?text=';

  public tweetWithText(text: string) {
    window.location.href = `${this._twitterShare}${text}`;
  }
}
