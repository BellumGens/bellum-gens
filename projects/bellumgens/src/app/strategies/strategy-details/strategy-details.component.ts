import { Component, Injector, PLATFORM_ID, Signal, effect, inject, signal, untracked } from '@angular/core';
import { toObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, map, switchMap, tap } from 'rxjs';
import { isPlatformBrowser, DatePipe, NgOptimizedImage } from '@angular/common';
import { BaseDirective } from '../../base/base.component';
import { RouterLink } from '@angular/router';
import {
  CSGOStrategy,
  VoteDirection,
  NEW_EMPTY_COMMENT,
  StrategyComment,
  LoginService,
  ApplicationUser,
  GLOBAL_OVERLAY_SETTINGS,
  SocialMediaStrategyService,
  ApiStrategiesService
} from '../../../../../common/src/public_api';
import { environment } from '../../../../../common/src/environments/environment.prod';
import { VotesPipe } from '../../pipes/votes.pipe';
import { HasVotedPipe } from '../../pipes/has-voted.pipe';
import { IsVideoPipe } from '../../pipes/is-video.pipe';
import { SafeVideoLinkPipe } from '../../pipes/safe-video-link.pipe';
import { ConfirmComponent } from '../../../../../common/src/lib/confirm/confirm.component';
import { FormsModule } from '@angular/forms';
import { IGX_CARD_DIRECTIVES } from '@infragistics/igniteui-angular/card';
import { IgxButtonDirective, IgxDividerComponent, IgxFlexDirective, IgxLayoutDirective, IgxRippleDirective, IgxToggleActionDirective } from '@infragistics/igniteui-angular/directives';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
import { IGX_LIST_DIRECTIVES } from '@infragistics/igniteui-angular/list';
import { IgxAvatarComponent } from '@infragistics/igniteui-angular/avatar';
import { IGX_DROP_DOWN_DIRECTIVES } from '@infragistics/igniteui-angular/drop-down';
import { IGX_INPUT_GROUP_DIRECTIVES } from '@infragistics/igniteui-angular/input-group';
import { LoadingComponent } from '../../../../../common/src/lib/loading/loading.component';

@Component({
  selector: 'app-strategy-details',
  templateUrl: './strategy-details.component.html',
  styleUrls: ['./strategy-details.component.scss'],
  host: {
    '(window:resize)': 'resize()'
  },
  imports: [
    NgOptimizedImage,
    DatePipe,
    FormsModule,
    RouterLink,
    LoadingComponent,
    IGX_CARD_DIRECTIVES,
    IgxLayoutDirective,
    IgxFlexDirective,
    IgxButtonDirective,
    IgxRippleDirective,
    IgxIconComponent,
    IgxDividerComponent,
    IGX_LIST_DIRECTIVES,
    IgxAvatarComponent,
    IgxToggleActionDirective,
    IGX_DROP_DOWN_DIRECTIVES,
    IGX_INPUT_GROUP_DIRECTIVES,
    ConfirmComponent,
    SafeVideoLinkPipe,
    IsVideoPipe,
    HasVotedPipe,
    VotesPipe
  ]
})
export class StrategyDetailsComponent extends BaseDirective {
  private platformId = inject(PLATFORM_ID);
  private apiService = inject(ApiStrategiesService);
  private authManager = inject(LoginService);
  private socialMedia = inject(SocialMediaStrategyService);
  private injector = inject(Injector);

  public strat = signal<CSGOStrategy>(null);
  public authUser: Signal<ApplicationUser> = this.authManager.applicationUser;
  public newComment = signal<StrategyComment>(Object.assign({}, NEW_EMPTY_COMMENT));
  public horizontal = signal(true);
  public overlaySettings = GLOBAL_OVERLAY_SETTINGS;

  constructor() {
    super();
    this.activeRoute.params.pipe(
      map(params => params['stratid'] as string),
      filter(stratid => !!stratid),
      tap(stratid => {
        this.meta.updateTag({ name: 'og:image', content: `${environment.rootApiEndpoint}/Content/Strats/${stratid}.png` });
        this.meta.updateTag({ name: 'twitter:image', content: `${environment.rootApiEndpoint}/Content/Strats/${stratid}.png` });
      }),
      switchMap(stratid => toObservable(this.apiService.getStrategy(stratid), { injector: this.injector })),
      filter(strat => !!strat),
      takeUntilDestroyed()
    ).subscribe(strat => {
      this.strat.set(strat);
      // The cached strategy is replaced on every vote/comment, so keep the comment draft unless the strategy changed.
      this.newComment.update(comment => comment.stratId === strat.id ? comment : { ...comment, stratId: strat.id });
    });
    effect(() => {
      const user = this.authUser();
      if (user) {
        untracked(() => this.newComment.update(comment => ({ ...comment, userId: user.id })));
      }
    });
    this.resize();
  }

  public resize() {
    if (isPlatformBrowser(this.platformId)) {
      this.horizontal.set(window.matchMedia('(min-width: 768px)').matches);
    }
  }

  public openLogin() {
    this.authManager.emitOpenLogin();
  }

  public voteStrat(strat: CSGOStrategy, direction: VoteDirection) {
    const authUser = this.authUser();
    if (!authUser) {
      this.openLogin();
    } else {
      this.apiService.submitStratVote(strat, direction, authUser.id).subscribe(updated => this.strat.set(updated));
    }
  }

  public submitComment() {
    // When editing, the model is the listed comment itself, so clear its edit marker directly.
    const comment = this.newComment();
    comment._inEdit = false;
    this.apiService.submitStratComment(comment, this.strat()).subscribe(updated => {
      this.strat.set(updated);
      this.newComment.set({ userId: this.authUser().id, stratId: updated.id, comment: null });
    });
  }

  public editComment(comment: StrategyComment) {
    comment._inEdit = true;
    this.newComment.set(comment);
  }

  public deleteComment(comment: StrategyComment) {
    this.apiService.deleteStratComment(comment, this.strat()).subscribe(updated => this.strat.set(updated));
  }

  public shareOnTwitter(strat: CSGOStrategy) {
    this.socialMedia.shareOnTwitter(strat);
  }
}
