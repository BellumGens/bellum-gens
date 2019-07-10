import { Component, ViewChild, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BellumgensApiService } from '../../services/bellumgens-api.service';
import { CSGOStrategy, newEmptyStrategy } from '../../models/csgostrategy';
import { MapPool, ActiveDutyDescriptor, ActiveDuty, AllMaps } from '../../models/csgomaps';
import { IgxDialogComponent, IChipSelectEventArgs } from 'igniteui-angular';
import { SafeResourceUrl, Title } from '@angular/platform-browser';
import { BaseComponent } from '../../base/base.component';
import { CSGOTeam } from '../../models/csgoteam';
import { IsVideoPipe } from '../../pipes/is-video.pipe';
import { LoginService } from '../../services/login.service';
import { ApplicationUser } from '../../models/applicationuser';

@Component({
  selector: 'app-team-strategies',
  templateUrl: './team-strategies.component.html',
  styleUrls: ['./team-strategies.component.css']
})
export class TeamStrategiesComponent extends BaseComponent {
  strats: CSGOStrategy [];
  maps: MapPool [] = AllMaps;
  mapList: ActiveDutyDescriptor [] = ActiveDuty;
  team: CSGOTeam;
  authUser: ApplicationUser;
  newStrategy: CSGOStrategy = newEmptyStrategy();
  sanitizedUrl: SafeResourceUrl;
  videoId: string;
  pipeTrigger = 0;
  changes = false;
  viewAll = false;
  selectedStrat: CSGOStrategy;
  selectedMap = this.mapList[0];
  loading = false;

  @Input()
  isAdmin = false;

  @Input()
  isEditor = false;

  @ViewChild('newStrat', { static: true }) public dialog: IgxDialogComponent;

  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private apiService: BellumgensApiService,
              private authManager: LoginService,
              private title: Title) {
    super();
    this.subs.push(
      this.activatedRoute.params.subscribe(params => {
        const teamId = params['teamid'];

        if (teamId) {
          this.apiService.getTeam(teamId).subscribe(team => this.team = team);
          this.apiService.getTeamStrats(teamId).subscribe(strats => this.strats = strats);
          this.apiService.getTeamMapPool(teamId).subscribe(maps => this.maps = maps);
        } else {
          this.apiService.loadingStrategies.subscribe(loading => this.loading = loading),
          this.apiService.strategies.subscribe(strats => this.strats = strats);
          this.title.setTitle('CS:GO Strategies: find or create ');
          this.newStrategy.Visible = true;
        }
      }),
      this.authManager.applicationUser.subscribe(user => this.authUser = user)
    );
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

  public editStrategy(strat: CSGOStrategy) {
    this.newStrategy = strat;
    this.dialog.open();
  }

  public submitStrategy() {
    this.newStrategy.TeamId = this.team.TeamId;
    this.apiService.submitStrategy(this.newStrategy).subscribe(
      strat => {
        if (!this.newStrategy.Id) {
          this.strats.push(strat);
          this.pipeTrigger++;
        }
        this.dialog.close();
      }
    );
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

  public deleteStrat(args: CSGOStrategy) {
    this.apiService.deleteStrategy(args.Id).subscribe(
      _ => {
        this.strats.splice(this.strats.indexOf(args), 1);
        this.pipeTrigger++;
      }
    );
  }

  public resetStrategy() {
    this.newStrategy = newEmptyStrategy(!this.team);
  }

  public createAndRedirect() {
    let route = ['strategies', 'edit'];
    if (this.team) {
      this.newStrategy.TeamId = this.team.TeamId;
      route = ['team', this.team.CustomUrl];
    }
    if (this.authUser) {
      this.newStrategy.UserId = this.authUser.id;
    }
    this.apiService.submitStrategy(this.newStrategy).subscribe(strat => {
      route.push(strat.CustomUrl);
      this.router.navigate(route);
    });
  }
}
