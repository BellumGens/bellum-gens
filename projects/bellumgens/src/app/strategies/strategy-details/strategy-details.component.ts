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
import { IgxButtonDirective, IgxDividerComponent, IgxFlexDirective, IgxIconButtonDirective, IgxLayoutDirective, IgxRippleDirective, IgxToggleActionDirective } from '@infragistics/igniteui-angular/directives';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
import { IGX_LIST_DIRECTIVES } from '@infragistics/igniteui-angular/list';
import { IgxAvatarComponent } from '@infragistics/igniteui-angular/avatar';
import { IGX_DROP_DOWN_DIRECTIVES, ISelectionEventArgs } from '@infragistics/igniteui-angular/drop-down';
import { IGX_INPUT_GROUP_DIRECTIVES } from '@infragistics/igniteui-angular/input-group';
import { LoadingComponent } from '../../../../../common/src/lib/loading/loading.component';
import { voteLabel } from '../vote-label';

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
    IgxIconButtonDirective,
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
  /**
   * Id of the listed comment being edited. The draft in newComment is a copy of it,
   * so the listed comment only changes once the edit is saved.
   */
  public editedCommentId = signal<string>(null);
  /** Id of the comment whose actions drop-down is open. */
  public openedActionsId = signal<string>(null);
  public horizontal = signal(true);
  public overlaySettings = GLOBAL_OVERLAY_SETTINGS;
  public voteLabel = voteLabel;
  /** Strategy image that failed to load; it is left out instead of showing a broken image. */
  public brokenImage = signal<string>(null);
  /** Names the author link when the strategy comes without its author's name. */
  public authorFallback = $localize`Profile`;

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
      if (this.newComment().stratId !== strat.id) {
        if (this.editedCommentId()) {
          // A comment of another strategy can't be edited here.
          this.resetComment(strat.id);
        } else {
          this.newComment.update(comment => ({ ...comment, stratId: strat.id }));
        }
      }
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
      this.apiService.submitStratVote(strat, direction, authUser.id).subscribe({
        next: updated => this.strat.set(updated),
        // The service already reports the error and the strategy is left as it was.
        error: () => undefined
      });
    }
  }

  public updateCommentText(text: string) {
    this.newComment.update(comment => ({ ...comment, comment: text }));
  }

  public submitComment() {
    this.apiService.submitStratComment(this.newComment(), this.strat()).subscribe({
      next: updated => {
        this.strat.set(updated);
        this.resetComment(updated.id);
      },
      // The service already reports the error. Keep the draft (and the edit) so it can be retried or cancelled.
      error: () => undefined
    });
  }

  /** Only the author of a comment can edit or delete it. */
  public isOwnComment(comment: StrategyComment) {
    const user = this.authUser();
    return !!user?.id && comment.userId === user.id;
  }

  public commentAction(event: ISelectionEventArgs, comment: StrategyComment, commentBox: HTMLTextAreaElement, confirm: ConfirmComponent) {
    // The actions only run commands, they don't keep a selection.
    event.cancel = true;
    switch (event.newSelection?.value) {
      case 'edit':
        this.editComment(comment);
        commentBox.focus();
        break;
      case 'delete':
        confirm.open(comment);
        break;
    }
  }

  public actionsClosed(commentId: string) {
    if (this.openedActionsId() === commentId) {
      this.openedActionsId.set(null);
    }
  }

  public editComment(comment: StrategyComment) {
    this.editedCommentId.set(comment.id);
    this.newComment.set({ ...comment });
  }

  public cancelEdit() {
    this.resetComment(this.strat().id);
  }

  public deleteComment(comment: StrategyComment) {
    this.apiService.deleteStratComment(comment, this.strat()).subscribe({
      next: updated => {
        this.strat.set(updated);
        if (comment.id === this.editedCommentId()) {
          this.resetComment(updated.id);
        }
      },
      // The service already reports the error and the comment stays listed.
      error: () => undefined
    });
  }

  public shareOnTwitter(strat: CSGOStrategy) {
    this.socialMedia.shareOnTwitter(strat);
  }

  private resetComment(stratId: string) {
    this.editedCommentId.set(null);
    this.newComment.set({ userId: this.authUser()?.id ?? null, stratId, comment: null });
  }
}
