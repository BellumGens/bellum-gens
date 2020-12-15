import { Injectable } from '@angular/core';
import { CSGOStrategy } from '../models/csgostrategy';

@Injectable({
  providedIn: 'root'
})
export class SocialMediaService {

  private _twitterShare = 'https://twitter.com/intent/tweet?text=';

  constructor() { }

  public tweetWithText(text: string) {
    window.location.href = `${this._twitterShare}${text}`;
  }

  public shareOnTwitter(strat: CSGOStrategy) {
    window.location.href = `${this._twitterShare}${this.stratTextForTwitter(strat)}`;
  }

  private stratTextForTwitter(strat: CSGOStrategy) {
    // tslint:disable-next-line:max-line-length
    return `Check out "${strat.title}" CS:GO strategy by ${strat.owner} on Bellum Gens https://bellumgens.com/strategies/details/${strat.customUrl}`;
  }
}
