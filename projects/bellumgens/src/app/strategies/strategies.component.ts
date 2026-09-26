import { Component, Injector, Signal, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe, NgOptimizedImage } from '@angular/common';
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
import { IChipSelectEventArgs, IGX_CHIPS_DIRECTIVES } from '@infragistics/igniteui-angular/chips';
import { IgxButtonDirective, IgxRippleDirective, IgxToggleActionDirective } from '@infragistics/igniteui-angular/directives';
import { IGX_INPUT_GROUP_DIRECTIVES } from '@infragistics/igniteui-angular/input-group';
import { IGX_CARD_DIRECTIVES } from '@infragistics/igniteui-angular/card';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
import { IGX_SELECT_DIRECTIVES } from '@infragistics/igniteui-angular/select';
import { IgxBadgeComponent } from '@infragistics/igniteui-angular/badge';
import { IGX_DROP_DOWN_DIRECTIVES } from '@infragistics/igniteui-angular/drop-down';
import { IgxAvatarComponent } from '@infragistics/igniteui-angular/avatar';
import { StratFilterPipe } from '../pipes/strat-filter.pipe';
import { SideStratsPipe } from '../pipes/sidestrats.pipe';
import { IsStratOwnerPipe } from '../pipes/is-strat-owner.pipe';
import { VotesPipe } from '../pipes/votes.pipe';
import { HasVotedPipe } from '../pipes/has-voted.pipe';
import { IsVideoPipe } from '../pipes/is-video.pipe';
import { SafeVideoLinkPipe } from '../pipes/safe-video-link.pipe';
import { TruncateTextPipe } from '../pipes/truncate-text.pipe';
import { ActiveDutyMapsPipe } from '../../../../common/src/lib/pipes/active-duty-maps.pipe';
import { ConfirmComponent } from '../../../../common/src/lib/confirm/confirm.component';
import { NewStrategyComponent } from './new-strategy/new-strategy.component';
import { LoadingComponent } from '../../../../common/src/lib/loading/loading.component';

@Component({
  selector: 'app-team-strategies',
  templateUrl: './strategies.component.html',
  styleUrls: ['./strategies.component.scss'],
  imports: [
    NgOptimizedImage,
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
  private activatedRoute = inject(ActivatedRoute);
  private apiService = inject(BellumgensApiService);
  private apiStrategyService = inject(ApiStrategiesService);
  private searchService = inject(ApiSearchService);
  private authManager = inject(LoginService);
  private commService = inject(CommunicationService);
  private socialMedia = inject(SocialMediaStrategyService);
  private injector = inject(Injector);

  public isEditor = signal<boolean>(null);

  public strats = signal<CSGOStrategy []>(undefined);
  public maps = signal<CSGOActiveDutyMap []>(structuredClone(ACTIVE_DUTY).map(map => ({ ...map, isPlayed: true })));
  public team = signal<CSGOTeam>(undefined);
  public authUser: Signal<ApplicationUser> = this.authManager.applicationUser;
  private authUser$ = toObservable(this.authUser);
  public viewAll = signal(false);
  public loading = signal(false);
  public hasMore = signal(false);
  public page = 0;
  public order = signal(StratOrderBy.TopVoted);

  public overlaySettings = GLOBAL_OVERLAY_SETTINGS;
  public stratOrder = StratOrder;

  constructor() {
    this.activatedRoute.url.subscribe(value => {
      if (value?.length && value[0]?.path === 'user') {
        this.authUser$.subscribe(user => {
          if (user) {
            this.apiStrategyService.getUserStrategies(user.id).subscribe(
              strats => this.strats.set(strats),
              error => this.commService.emitError(error.message)
            );
          }
        });
      } else {
        this.activatedRoute.parent.parent.params.subscribe(params => {
          const teamId = params['teamid'];

          if (teamId) {
            toObservable(this.apiService.getTeam(teamId), { injector: this.injector }).subscribe(team => {
              if (team) {
                this.team.set(team);
                this.loading.set(true);
                this.apiStrategyService.getTeamStrats(team.teamId).subscribe(strats => {
                  this.loading.set(false);
                  this.strats.set(strats);
                });
                this.authManager.getUserIsTeamEditor(team.teamId).subscribe(data => this.isEditor.set(data));
              }
            });
          } else {
            this.activatedRoute.params.subscribe(param => {
              const query = param['query'];

              if (query) {
                this.searchService.searchStrategies(query);
                this.mirror(this.searchService.loadingSearch, loading => this.loading.set(loading));
                this.mirror(this.searchService.strategySearchResult, strats => this.strats.set(strats));
              } else {
                this.mirror(this.apiStrategyService.loadingStrategies, loading => this.loading.set(loading));
                this.mirror(this.apiStrategyService.strategies, strats => this.strats.set(strats));
                this.mirror(this.apiStrategyService.hasMoreStrats, hasMore => this.hasMore.set(hasMore));
              }
            });
          }
        });
      }
    });
  }

  public openLogin() {
    this.authManager.emitOpenLogin();
  }

  public changeMaps(event: IChipSelectEventArgs, args: CSGOActiveDutyMap) {
    if (event.originalEvent) {
      this.maps.update(maps => maps.map(m => m.mapId === args.mapId ? { ...m, isPlayed: event.selected } : m));
    }
  }

  public deleteStrat(args: CSGOStrategy) {
    this.apiStrategyService.deleteStrategy(args.id).subscribe({
      next: () => this.strats.update(strats => strats.filter(s => s !== args)),
      // The service already tells the user; the strategy just stays in the list
      error: () => {}
    });
  }

  public shareOnTwitter(strat: CSGOStrategy) {
    this.socialMedia.shareOnTwitter(strat);
  }

  public onStrategyAdded(strat: CSGOStrategy) {
    this.strats.update(strats => [...(strats || []), strat]);
  }

  public loadMore() {
    this.apiStrategyService.loadStrategiesPage(++this.page);
  }

  public voteStrat(strat: CSGOStrategy, direction: VoteDirection) {
    const authUser = this.authUser();
    if (!authUser) {
      this.openLogin();
    } else {
      // The service emits a new strategy object (its own caches are updated too), so swap it into the list.
      this.apiStrategyService.submitStratVote(strat, direction, authUser.id).subscribe(updated =>
        this.strats.update(strats => strats?.map(s => s.id === updated.id ? updated : s))
      );
    }
  }

  // Mirrors a service signal into local state while the component is alive; the local state is also
  // edited directly (votes, deletions, additions), so it can't just be a computed.
  private mirror<T>(source: Signal<T>, apply: (value: T) => void) {
    toObservable(source, { injector: this.injector }).subscribe(apply);
  }
}
