import { Injectable, inject } from '@angular/core';
import { CSGOStrategy } from 'bellum-gens-common/models';
import { SocialMediaService } from './social-media.service';
import { PAGE_LOCATION } from './page-location';

@Injectable({
  providedIn: 'root'
})
export class SocialMediaStrategyService extends SocialMediaService {
  private location = inject(PAGE_LOCATION);

  public shareOnTwitter(strat: CSGOStrategy) {
    this.location.href = `${this._twitterShare}${this.stratTextForTwitter(strat)}`;
  }

  private stratTextForTwitter(strat: CSGOStrategy) {
    return `Check out "${strat.title}" Counter-Strike strategy by ${strat.owner} on Bellum Gens https://bellumgens.com/strategies/details/${strat.customUrl}`;
  }
}
