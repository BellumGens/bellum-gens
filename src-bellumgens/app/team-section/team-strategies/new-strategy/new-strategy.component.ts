import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { CSGOStrategy, newEmptyStrategy } from '../../../models/csgostrategy';
import { BellumgensApiService } from '../../../services/bellumgens-api.service';
import { CSGOTeam } from '../../../models/csgoteam';
import { IgxDialogComponent } from 'igniteui-angular';
import { IsVideoPipe } from '../../../pipes/is-video.pipe';
import { ApplicationUser } from '../../../models/applicationuser';
import { Router } from '@angular/router';
import { ActiveDutyDescriptor, ActiveDuty } from '../../../models/csgomaps';

@Component({
  selector: 'app-new-strategy',
  templateUrl: './new-strategy.component.html',
  styleUrls: ['./new-strategy.component.css']
})
export class NewStrategyComponent implements OnInit {
  private _defaultTitle = 'Add a new team strategy';

  public newStrategy: CSGOStrategy = newEmptyStrategy();
  public videoId: string;
  public mapList: ActiveDutyDescriptor [] = ActiveDuty;
  public selectedMap = this.mapList[0];
  public title = 'Add a new team strategy';

  @ViewChild('newStrat', { static: true }) public dialog: IgxDialogComponent;

  @Input()
  public team: CSGOTeam;

  @Input()
  public authUser: ApplicationUser;

  @Output()
  public strategyAdded = new EventEmitter<CSGOStrategy>();

  constructor(private apiService: BellumgensApiService,
              private router: Router) {
  }

  ngOnInit() {
  }

  public open(strat?: CSGOStrategy, title?: string) {
    if (strat) {
      this.newStrategy = strat;
    } else if (!this.team) {
      this.newStrategy.Visible = true;
    }

    if (title) {
      this.title = title;
    } else {
      this.title = this._defaultTitle;
    }
    this.dialog.open();
  }

  public resetStrategy() {
    this.newStrategy = newEmptyStrategy(!this.team);
  }

  public submitStrategy() {
    this.newStrategy.TeamId = this.team.TeamId;
    this.apiService.submitStrategy(this.newStrategy).subscribe(
      strat => {
        if (!this.newStrategy.Id) {
          this.strategyAdded.emit(strat);
        }
        this.dialog.close();
      }
    );
  }

  public createAndRedirect() {
    let route = ['strategies', 'edit'];
    if (this.team) {
      this.newStrategy.TeamId = this.team.TeamId;
      route = ['team', this.team.CustomUrl];
    }
    this.apiService.submitStrategy(this.newStrategy).subscribe(strat => {
      route.push(strat.CustomUrl);
      this.router.navigate(route);
    });
  }

  public getVideoEmbedLink() {
    if (IsVideoPipe.isYoutube(this.newStrategy.Url)) {
      const parts = IsVideoPipe._youtubeRegEx.exec(this.newStrategy.Url);
      if (this.videoId && this.videoId === parts[5]) {
        return true;
      }
      this.videoId = parts[5];
      this.newStrategy.Url = this.getYoutubeEmbedLink(this.newStrategy.Url);
      return true;
    } else if (IsVideoPipe.isTwitch(this.newStrategy.Url)) {
      const parts = IsVideoPipe._twitchRegEx.exec(this.newStrategy.Url);
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
    const parts = IsVideoPipe._youtubeRegEx.exec(url);
    return `https://www.youtube.com/embed/${parts[5]}`;
  }

  public getTwitchEmbedLink(url: string): string {
    const parts = IsVideoPipe._twitchRegEx.exec(url);
    return `https://player.twitch.tv/?autoplay=false&video=v${parts[3]}`;
  }

}
