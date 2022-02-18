import { Injectable } from '@angular/core';
import { CSGOStrategy } from '../models/csgostrategy';
import { SocialMediaService } from './social-media.service';

@Injectable({
  providedIn: 'root'
})
export class SocialMediaStrategyService extends SocialMediaService {

  public shareOnTwitter(strat: CSGOStrategy) {
    window.location.href = `${this._twitterShare}${this.stratTextForTwitter(strat)}`;
  }

  private stratTextForTwitter(strat: CSGOStrategy) {
    // eslint-disable-next-line max-len
    return `Check out "${strat.title}" CS:GO strategy by ${strat.owner} on Bellum Gens https://bellumgens.com/strategies/details/${strat.customUrl}`;
  }
}
