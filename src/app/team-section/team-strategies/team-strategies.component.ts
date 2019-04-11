import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BellumgensApiService } from '../../services/bellumgens-api.service';
import { TeamStrategy, newEmptyStrategy } from '../../models/csgoteamstrategy';
import { MapPool, ActiveDutyDescriptor, ActiveDuty } from '../../models/csgomaps';
import { IgxDialogComponent, IChipSelectEventArgs } from 'igniteui-angular';
import { SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-team-strategies',
  templateUrl: './team-strategies.component.html',
  styleUrls: ['./team-strategies.component.css']
})
export class TeamStrategiesComponent implements OnInit {
  teamStrats: TeamStrategy [];
  maps: MapPool [];
  mapList: ActiveDutyDescriptor [] = ActiveDuty;
  teamId: string;
  newStrategy: TeamStrategy = newEmptyStrategy();
  sanitizedUrl: SafeResourceUrl;
  videoId: string;
  pipeTrigger = 0;
  changes = false;
  viewAll = false;

  @Input()
  isAdmin = false;

  @Input()
  isEditor = false;

  private _youtubeRegEx = /(youtu\.be\/|youtube\.com\/(watch\?(.*&)?v=|(embed|v)\/))([^\?&"'>]+)/;
  private _twitchRegEx = /(twitch\.tv\/)(videos\/|\?[^\?"'>]+video\=v)([^\?&"'>]+)/;

  @ViewChild(IgxDialogComponent) public dialog: IgxDialogComponent;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private apiService: BellumgensApiService) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.teamId = params['teamid'];

      if (this.teamId) {
        this.apiService.getTeamStrats(this.teamId).subscribe(strats => this.teamStrats = strats);
        this.apiService.getTeamMapPool(this.teamId).subscribe(maps => this.maps = maps);
      }
    });
  }

  public changeMaps(event: IChipSelectEventArgs, args: MapPool) {
    if (event.originalEvent) {
      this.maps.find(m => m.Map === args.Map).IsPlayed = event.selected;
      this.changes = true;
      this.pipeTrigger++;
    }
  }

  public saveMaps(event: Event) {
    event.stopPropagation();
    this.apiService.setTeamMapPool(this.maps).subscribe(
      _ => {
        this.changes = false;
      }
    );
  }

  public openNewStrategy(event: Event) {
    event.stopPropagation();
    this.dialog.open();
  }

  public editStrategy(strat: TeamStrategy) {
    this.newStrategy = strat;
    this.dialog.open();
  }

  public submitStrategy() {
    this.newStrategy.TeamId = this.teamId;
    this.apiService.submitStrategy(this.newStrategy).subscribe(
      strat => {
        if (!this.newStrategy.Id) {
          this.teamStrats.push(strat);
          this.pipeTrigger++;
        }
        this.dialog.close();
      }
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

  public deleteStrat(args: TeamStrategy) {
    this.apiService.deleteStrategy(args.Id, args.TeamId).subscribe(
      _ => {
        this.teamStrats.splice(this.teamStrats.indexOf(args), 1);
        this.pipeTrigger++;
      }
    );
  }

  public resetStrategy() {
    this.newStrategy = newEmptyStrategy();
  }

  public createAndRedirect() {
    this.newStrategy.TeamId = this.teamId;
    this.apiService.submitStrategy(this.newStrategy).subscribe(strat => this.router.navigate(['team', this.teamId, strat.Id]));
  }
}
