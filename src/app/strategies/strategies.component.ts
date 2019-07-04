import { Component } from '@angular/core';
import { CSGOStrategy } from '../models/csgostrategy';
import { BellumgensApiService } from '../services/bellumgens-api.service';
import { BaseComponent } from '../base/base.component';
import { ActiveDuty } from '../models/csgomaps';

@Component({
  selector: 'app-strategies',
  templateUrl: './strategies.component.html',
  styleUrls: ['./strategies.component.css']
})
export class StrategiesComponent extends BaseComponent {

  public maps = ActiveDuty;
  public strats: CSGOStrategy [];
  public loading = true;

  private _youtubeRegEx = /(youtu\.be\/|youtube\.com\/(watch\?(.*&)?v=|(embed|v)\/))([^\?&"'>]+)/;
  private _twitchRegEx = /(twitch\.tv\/)(videos\/|\?[^\?"'>]+video\=v)([^\?&"'>]+)/;

  constructor(private apiServer: BellumgensApiService) {
    super();
    this.subs.push(
      this.apiServer.loadingStrategies.subscribe(loading => this.loading = loading),
      this.apiServer.strategies.subscribe(strats => this.strats = strats)
    );
  }

  public isVideo(url: string) {
    return this.isYoutube(url) || this.isTwitch(url);
  }

  public isYoutube(url: string) {
    return this._youtubeRegEx.test(url);
  }

  public isTwitch(url: string) {
    return this._twitchRegEx.test(url);
  }
}
