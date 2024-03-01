import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf, NgClass, DatePipe, NgOptimizedImage } from '@angular/common';
import {
  BellumgensApiService,
  CSGOStrategy, VoteDirection,
  CSGOTeam,
  LoginService,
  ApplicationUser,
  GLOBAL_OVERLAY_SETTINGS, StratOrder, StratOrderBy,
  SocialMediaStrategyService,
  ApiSearchService,
  ApiStrategiesService,
  CommunicationService,
  CSGOActiveDutyMap,
  ACTIVE_DUTY
} from '../../../../common/src/public_api';
import {
  IChipSelectEventArgs,
  IgxButtonDirective,
  IgxRippleDirective,
  IGX_CHIPS_DIRECTIVES,
  IGX_INPUT_GROUP_DIRECTIVES,
  IGX_CARD_DIRECTIVES,
  IgxIconComponent,
  IgxToggleActionDirective,
  IGX_SELECT_DIRECTIVES,
  IgxBadgeComponent,
  IGX_DROP_DOWN_DIRECTIVES,
  IgxAvatarComponent
} from '@infragistics/igniteui-angular';
import { StratFilterPipe } from '../pipes/strat-filter.pipe';
import { SideStratsPipe } from '../pipes/sidestrats.pipe';
import { IsStratOwnerPipe } from '../pipes/is-strat-owner.pipe';
import { VotesPipe } from '../pipes/votes.pipe';
import { HasVotedPipe } from '../pipes/has-voted.pipe';
import { IsVideoPipe } from '../pipes/is-video.pipe';
import { SafeVideoLinkPipe } from '../pipes/safe-video-link.pipe';
import { TruncateTextPipe } from '../pipes/truncate-text.pipe';
import { ActiveDutyMapsPipe } from '../../../../common/src/lib/pipes/active-duty-maps.pipe';
import { CSGOMapnamePipe } from '../../../../common/src/lib/pipes/csgomapname.pipe';
import { ConfirmComponent } from '../../../../common/src/lib/confirm/confirm.component';
import { NewStrategyComponent } from './new-strategy/new-strategy.component';
import { LoadingComponent } from '../../../../common/src/lib/loading/loading.component';

@Component({
    selector: 'app-team-strategies',
    templateUrl: './strategies.component.html',
    styleUrls: ['./strategies.component.scss'],
    standalone: true,
    imports: [
      NgOptimizedImage,
      NgFor,
      NgIf,
      NgClass,
      DatePipe,
      RouterLink,
      FormsModule,
      IgxButtonDirective,
      IgxRippleDirective,
      IGX_CHIPS_DIRECTIVES,
      IGX_SELECT_DIRECTIVES,
      IGX_INPUT_GROUP_DIRECTIVES,
      LoadingComponent,
      IGX_CARD_DIRECTIVES,
      IgxIconComponent,
      IgxToggleActionDirective,
      IgxBadgeComponent,
      IGX_DROP_DOWN_DIRECTIVES,
      IgxAvatarComponent,
      NewStrategyComponent,
      ConfirmComponent,
      CSGOMapnamePipe,
      ActiveDutyMapsPipe,
      TruncateTextPipe,
      SafeVideoLinkPipe,
      IsVideoPipe,
      HasVotedPipe,
      VotesPipe,
      IsStratOwnerPipe,
      SideStratsPipe,
      StratFilterPipe
    ]
})
export class StrategiesComponent {
  public isEditor: boolean = null;

  public strats: CSGOStrategy [];
  public maps: CSGOActiveDutyMap [] = structuredClone(ACTIVE_DUTY);
  public team: CSGOTeam;
  public authUser: ApplicationUser;
  public pipeTrigger = 0;
  public viewAll = false;
  public loading = false;
  public hasMore = false;
  public page = 0;
  public order = StratOrderBy.TopVoted;

  public overlaySettings = GLOBAL_OVERLAY_SETTINGS;
  public stratOrder = StratOrder;

  constructor(private activatedRoute: ActivatedRoute,
              private apiService: BellumgensApiService,
              private apiStrategyService: ApiStrategiesService,
              private searchService: ApiSearchService,
              private authManager: LoginService,
              private commService: CommunicationService,
              private socialMedia: SocialMediaStrategyService) {
    this.maps.forEach(map => map.isPlayed = true);
    this.activatedRoute.url.subscribe(value => {
      if (value?.length && value[0]?.path === 'user') {
        this.authManager.applicationUser.subscribe(user => {
          if (user) {
            this.authUser = user;
            this.apiStrategyService.getUserStrategies(user.id).subscribe(
              strats => this.strats = strats,
              error => this.commService.emitError(error.message)
            );
          }
        });
      } else {
        this.activatedRoute.parent.parent.params.subscribe(params => {
          const teamId = params['teamid'];

          if (teamId) {
            this.apiService.getTeam(teamId).subscribe(team => {
              if (team) {
                this.team = team;
                this.loading = true;
                this.apiStrategyService.getTeamStrats(team.teamId).subscribe(strats => {
                  this.loading = false;
                  this.strats = strats;
                });
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
                this.apiStrategyService.loadingStrategies.subscribe(loading => this.loading = loading);
                this.apiStrategyService.strategies.subscribe(strats => this.strats = strats);
                this.apiStrategyService.hasMoreStrats.subscribe(hasMore => this.hasMore = hasMore);
              }
            });
          }
        });
        this.authManager.applicationUser.subscribe(user => this.authUser = user);
      }
    });
  }

  public openLogin() {
    this.authManager.emitOpenLogin();
  }

  public changeMaps(event: IChipSelectEventArgs, args: CSGOActiveDutyMap) {
    if (event.originalEvent) {
      this.maps.find(m => m.mapId === args.mapId).isPlayed = event.selected;
      this.pipeTrigger++;
    }
  }

  public deleteStrat(args: CSGOStrategy) {
    this.apiStrategyService.deleteStrategy(args.id).subscribe(() => this.strats.splice(this.strats.indexOf(args), 1));
  }

  public shareOnTwitter(strat: CSGOStrategy) {
    this.socialMedia.shareOnTwitter(strat);
  }

  public onStrategyAdded(strat: CSGOStrategy) {
    this.strats.push(strat);
    this.pipeTrigger++;
  }

  public loadMore() {
    this.apiStrategyService.loadStrategiesPage(++this.page);
  }

  public voteStrat(strat: CSGOStrategy, direction: VoteDirection) {
    if (!this.authUser) {
      this.openLogin();
    } else {
      this.apiStrategyService.submitStratVote(strat, direction, this.authUser.id).subscribe(() => this.pipeTrigger++);
    }
  }
}
