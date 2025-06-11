import { Component, HostListener, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser, NgClass, DatePipe, NgOptimizedImage } from '@angular/common';
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
import { IGX_CARD_DIRECTIVES, IgxLayoutDirective, IgxFlexDirective, IgxButtonDirective, IgxRippleDirective, IgxIconComponent, IgxDividerDirective, IGX_LIST_DIRECTIVES, IgxAvatarComponent, IgxToggleActionDirective, IGX_DROP_DOWN_DIRECTIVES, IGX_INPUT_GROUP_DIRECTIVES } from '@infragistics/igniteui-angular';
import { LoadingComponent } from '../../../../../common/src/lib/loading/loading.component';

@Component({
  selector: 'app-strategy-details',
  templateUrl: './strategy-details.component.html',
  styleUrls: ['./strategy-details.component.scss'],
  imports: [
    NgOptimizedImage,
    NgClass,
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
    IgxDividerDirective,
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

  public strat: CSGOStrategy;
  public authUser: ApplicationUser;
  public pipeTrigger = 0;
  public newComment = Object.assign({}, NEW_EMPTY_COMMENT);
  public horizontal = true;
  public overlaySettings = GLOBAL_OVERLAY_SETTINGS;

  constructor() {
    super();
    this.activeRoute.params.subscribe(params => {
      const stratid = params['stratid'];
      if (stratid) {
        this.meta.updateTag({ name: 'og:image', content: `${environment.rootApiEndpoint}/Content/Strats/${stratid}.png` });
        this.meta.updateTag({ name: 'twitter:image', content: `${environment.rootApiEndpoint}/Content/Strats/${stratid}.png` });
        this.apiService.getStrategy(stratid).subscribe(strat => {
          if (strat) {
            this.strat = strat;
            this.newComment.stratId = strat.id;
          }
        });
      }
    });
    this.authManager.applicationUser.subscribe(user => {
      this.authUser = user;
      if (user) {
        this.newComment.userId = user.id;
      }
    });
    this.resize();
  }

  @HostListener('window:resize')
  public resize() {
    if (isPlatformBrowser(this.platformId)) {
      this.horizontal = window.matchMedia('(min-width: 768px)').matches;
    }
  }

  public openLogin() {
    this.authManager.emitOpenLogin();
  }

  public voteStrat(strat: CSGOStrategy, direction: VoteDirection) {
    if (!this.authUser) {
      this.openLogin();
    } else {
      this.apiService.submitStratVote(strat, direction, this.authUser.id).subscribe(() => this.pipeTrigger++);
    }
  }

  public submitComment() {
    this.newComment._inEdit = false;
    this.apiService.submitStratComment(this.newComment, this.strat).subscribe(() => {
      this.newComment = { userId: this.authUser.id, stratId: this.strat.id, comment: null };
    });
  }

  public editComment(comment: StrategyComment) {
    this.newComment = comment;
    this.newComment._inEdit = true;
    this.pipeTrigger++;
  }

  public deleteComment(comment: StrategyComment) {
    this.apiService.deleteStratComment(comment, this.strat).subscribe(() => this.pipeTrigger++);
  }

  public shareOnTwitter(strat: CSGOStrategy) {
    this.socialMedia.shareOnTwitter(strat);
  }
}
