import { Component, ViewChild } from '@angular/core';
import { CSGOStrategy, newEmptyStrategy } from '../models/csgostrategy';
import { BellumgensApiService } from '../services/bellumgens-api.service';
import { BaseComponent } from '../base/base.component';
import { ActiveDuty } from '../models/csgomaps';
import { IgxDialogComponent } from 'igniteui-angular';

@Component({
  selector: 'app-strategies',
  templateUrl: './strategies.component.html',
  styleUrls: ['./strategies.component.css']
})
export class StrategiesComponent extends BaseComponent {

  public maps = ActiveDuty;
  public strats: CSGOStrategy [];
  public loading = true;
  public newStrategy: CSGOStrategy = newEmptyStrategy();
  public videoId: string;
  public selectedMap = this.maps[0];

  @ViewChild('newStrat', { static: true })
  public dialog: IgxDialogComponent;

  private _youtubeRegEx = /(youtu\.be\/|youtube\.com\/(watch\?(.*&)?v=|(embed|v)\/))([^\?&"'>]+)/;
  private _twitchRegEx = /(twitch\.tv\/)(videos\/|\?[^\?"'>]+video\=v)([^\?&"'>]+)/;

  constructor(private apiService: BellumgensApiService) {
    super();
    this.subs.push(
      this.apiService.loadingStrategies.subscribe(loading => this.loading = loading),
      this.apiService.strategies.subscribe(strats => this.strats = strats)
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

  public getVideoEmbedLink() {
    if (this.isYoutube(this.newStrategy.Url)) {
      const parts = this._youtubeRegEx.exec(this.newStrategy.Url);
      if (this.videoId && this.videoId === parts[5]) {
        return true;
      }
      this.videoId = parts[5];
      this.newStrategy.Url = this.getYoutubeEmbedLink(this.newStrategy.Url);
      return true;
    } else if (this.isTwitch(this.newStrategy.Url)) {
      const parts = this._twitchRegEx.exec(this.newStrategy.Url);
      if (this.videoId && this.videoId === parts[3]) {
        return true;
      }
      this.videoId = parts[3];
      this.newStrategy.Url = this.getTwitchEmbedLink(this.newStrategy.Url);
      return true;
    }
    return false;
  }

  public getYoutubeEmbedLink(url: string): string {
    const parts = this._youtubeRegEx.exec(url);
    return `https://www.youtube.com/embed/${parts[5]}`;
  }

  public getTwitchEmbedLink(url: string): string {
    const parts = this._twitchRegEx.exec(url);
    return `https://player.twitch.tv/?autoplay=false&video=v${parts[3]}`;
  }

  public resetStrategy() {
    this.newStrategy = newEmptyStrategy();
  }

  public submitStrategy() {
    this.apiService.submitStrategy(this.newStrategy).subscribe(
      strat => this.dialog.close()
    );
  }
}
