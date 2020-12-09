import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BellumgensApiService } from '../../../../src-common/services/bellumgens-api.service';
import { CSGOStrategy, VoteDirection } from '../../../../src-common/models/csgostrategy';
import { CSGOMapPool, AllCSGOMaps } from '../../../../src-common/models/csgomaps';
import { IChipSelectEventArgs } from '@infragistics/igniteui-angular';
import { SafeResourceUrl } from '@angular/platform-browser';
import { CSGOTeam } from '../../../../src-common/models/csgoteam';
import { LoginService } from '../../../../src-common/services/login.service';
import { ApplicationUser } from '../../../../src-common/models/applicationuser';
import { GlobalOverlaySettings, StratOrder, StratOrderBy } from '../../../../src-common/models/misc';
import { SocialMediaService } from '../../../../src-common/services/social-media.service';
import { ApiSearchService } from '../../../../src-common/services/bellumgens-api.search.service';

@Component({
  selector: 'app-team-strategies',
  templateUrl: './team-strategies.component.html',
  styleUrls: ['./team-strategies.component.scss']
})
export class TeamStrategiesComponent {
  public isEditor: boolean = null;

  public strats: CSGOStrategy [];
  public maps: CSGOMapPool [] = AllCSGOMaps;
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

  constructor(private activatedRoute: ActivatedRoute,
              private apiService: BellumgensApiService,
              private searchService: ApiSearchService,
              private authManager: LoginService,
              private socialMedia: SocialMediaService) {
    this.activatedRoute.parent.params.subscribe(params => {
      const teamId = params['teamid'];

      if (teamId) {
        this.apiService.getTeam(teamId).subscribe(team => {
          if (team) {
            this.team = team;
            this.apiService.loadingStrategies.subscribe(loading => this.loading = loading);
            this.apiService.getTeamStrats(team.teamId).subscribe(strats => this.strats = strats);
            this.apiService.getTeamMapPool(team.teamId).subscribe(maps => this.maps = maps);
            this.authManager.getUserIsTeamEditor(team.teamId).subscribe(data => this.isEditor = data);
          }
        });
      } else {
        this.activatedRoute.params.subscribe(param => {
          const query = param['query'];

          if (query) {
            this.searchService.searchStrategies(query);
            this.searchService.loadingSearch.subscribe(loading => this.loading = loading);
            this.searchService.strategySearchResult.subscribe(strats => this.strats = strats);
          } else {
            this.apiService.loadingStrategies.subscribe(loading => this.loading = loading);
            this.apiService.strategies.subscribe(strats => this.strats = strats);
            this.apiService.hasMoreStrats.subscribe(hasMore => this.hasMore = hasMore);
          }
        });
      }
    });
    this.authManager.applicationUser.subscribe(user => this.authUser = user);
  }

  public openLogin(title?: string) {
    this.authManager.emitOpenLogin(title);
  }

  public changeMaps(event: IChipSelectEventArgs, args: CSGOMapPool) {
    if (event.originalEvent) {
      this.maps.find(m => m.map === args.map).isPlayed = event.selected;
      this.pipeTrigger++;
    }
  }

  public deleteStrat(args: CSGOStrategy) {
    this.apiService.deleteStrategy(args.id).subscribe(
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
      this.openLogin('You need to login first');
    } else {
      this.apiService.submitStratVote(strat, direction, this.authUser.id).subscribe(_ => this.pipeTrigger++);
    }
  }
}
