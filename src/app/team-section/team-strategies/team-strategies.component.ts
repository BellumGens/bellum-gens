import { Component, Input, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BellumgensApiService } from '../../services/bellumgens-api.service';
import { CSGOStrategy, VoteDirection } from '../../models/csgostrategy';
import { MapPool, AllMaps } from '../../models/csgomaps';
import { IChipSelectEventArgs } from 'igniteui-angular';
import { SafeResourceUrl, Title } from '@angular/platform-browser';
import { BaseComponent } from '../../base/base.component';
import { CSGOTeam } from '../../models/csgoteam';
import { LoginService } from '../../services/login.service';
import { ApplicationUser } from '../../models/applicationuser';
import { GlobalOverlaySettings, StratOrder, StratOrderBy } from '../../models/misc';
import { LoginDialogComponent } from '../../login/login-dialog/login-dialog.component';
import { SocialMediaService } from '../../services/social-media.service';

@Component({
  selector: 'app-team-strategies',
  templateUrl: './team-strategies.component.html',
  styleUrls: ['./team-strategies.component.css']
})
export class TeamStrategiesComponent extends BaseComponent {
  private _isEditor = null;

  public strats: CSGOStrategy [];
  public maps: MapPool [] = AllMaps;
  public team: CSGOTeam;
  public authUser: ApplicationUser;
  public sanitizedUrl: SafeResourceUrl;
  public pipeTrigger = 0;
  public viewAll = false;
  public selectedStrat: CSGOStrategy;
  public loading = false;
  public hasMore = false;
  public page = 0;
  public order = StratOrderBy.TopVoted;

  public overlaySettings = GlobalOverlaySettings;
  public stratOrder = StratOrder;

  @ViewChild(LoginDialogComponent, {static: true})
  public loginDialog: LoginDialogComponent;

  constructor(private activatedRoute: ActivatedRoute,
              private apiService: BellumgensApiService,
              private authManager: LoginService,
              private socialMedia: SocialMediaService,
              private title: Title) {
    super();
    this.subs.push(
      this.activatedRoute.parent.params.subscribe(params => {
        const teamId = params['teamid'];

        if (teamId) {
          this.apiService.getTeam(teamId).subscribe(team => this.team = team);
          this.apiService.getTeamStrats(teamId).subscribe(strats => this.strats = strats);
          this.apiService.getTeamMapPool(teamId).subscribe(maps => this.maps = maps);
        } else {
          this.subs.push(
            this.activatedRoute.params.subscribe(param => {
              const query = param['query'];

              if (query) {
                this.apiService.searchStrategies(query);
                this.apiService.loadingSearch.subscribe(loading => this.loading = loading);
                this.apiService.strategySearchResult.subscribe(strats => this.strats = strats);
              } else {
                this.apiService.loadingStrategies.subscribe(loading => this.loading = loading),
                this.apiService.strategies.subscribe(strats => this.strats = strats);
                this.apiService.hasMoreStrats.subscribe(hasMore => this.hasMore = hasMore);
              }
            })
          );
        }

        this.title.setTitle('CS:GO Strategies: find or create ');
      }),
      this.authManager.applicationUser.subscribe(user => this.authUser = user)
    );
  }

  public changeMaps(event: IChipSelectEventArgs, args: MapPool) {
    if (event.originalEvent) {
      this.maps.find(m => m.Map === args.Map).IsPlayed = event.selected;
      this.pipeTrigger++;
    }
  }

  public saveMaps(event: Event) {
    event.stopPropagation();
    this.apiService.setTeamMapPool(this.maps).subscribe();
  }

  public deleteStrat(args: CSGOStrategy) {
    this.apiService.deleteStrategy(args.Id).subscribe(
      _ => {
        this.strats.splice(this.strats.indexOf(args), 1);
        this.pipeTrigger++;
      }
    );
  }

  public shareOnTwitter(strat: CSGOStrategy) {
    this.socialMedia.shareOnTwitter(strat);
  }

  public onStrategyAdded(strat: CSGOStrategy) {
    this.strats.push(strat);
    this.pipeTrigger++;
  }

  public loadMore() {
    this.apiService.loadStrategiesPage(++this.page);
  }

  public voteStrat(strat: CSGOStrategy, direction: VoteDirection) {
    if (!this.authUser) {
      this.loginDialog.openLogin('You need to login first');
    } else {
      this.apiService.submitStratVote(strat, direction, this.authUser.id).subscribe(_ => this.pipeTrigger++);
    }
  }

  public get isEditor() {
    if (this._isEditor !== null) {
      return this._isEditor;
    }
    if (this.authUser && this.team && this.team.Members) {
      this._isEditor = this.team.Members.filter(m => (m.IsEditor || m.IsAdmin) && m.UserId === this.authUser.id).length > 0;
    }
    return this._isEditor;
  }
}
