import { Component, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, NgIf, NgClass, NgFor, DatePipe, NgOptimizedImage } from '@angular/common';
import { BaseComponent } from '../../base/base.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
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
import { Title, Meta } from '@angular/platform-browser';
import { environment } from '../../../../../common/src/environments/environment.prod';
import { VotesPipe } from '../../pipes/votes.pipe';
import { HasVotedPipe } from '../../pipes/has-voted.pipe';
import { IsVideoPipe } from '../../pipes/is-video.pipe';
import { SafeVideoLinkPipe } from '../../pipes/safe-video-link.pipe';
import { ConfirmComponent } from '../../../../../common/src/lib/confirm/confirm.component';
import { FormsModule } from '@angular/forms';
import { IgxCardModule, IgxLayoutModule, IgxButtonModule, IgxRippleModule, IgxIconModule, IgxDividerModule, IgxListModule, IgxAvatarModule, IgxToggleModule, IgxDropDownModule, IgxInputGroupModule } from '@infragistics/igniteui-angular';
import { LoadingComponent } from '../../../../../common/src/lib/loading/loading.component';

@Component({
    selector: 'app-strategy-details',
    templateUrl: './strategy-details.component.html',
    styleUrls: ['./strategy-details.component.scss'],
    standalone: true,
    imports: [
      NgOptimizedImage,
      NgIf,
      NgFor,
      NgClass,
      DatePipe,
      FormsModule,
      RouterLink,
      LoadingComponent,
      IgxCardModule,
      IgxLayoutModule,
      IgxButtonModule,
      IgxRippleModule,
      IgxIconModule,
      IgxDividerModule,
      IgxListModule,
      IgxAvatarModule,
      IgxToggleModule,
      IgxDropDownModule,
      IgxInputGroupModule,
      ConfirmComponent,
      SafeVideoLinkPipe,
      IsVideoPipe,
      HasVotedPipe,
      VotesPipe
    ]
})
export class StrategyDetailsComponent extends BaseComponent {
  public strat: CSGOStrategy;
  public authUser: ApplicationUser;
  public pipeTrigger = 0;
  public newComment = Object.assign({}, NEW_EMPTY_COMMENT);
  public horizontal = true;
  public overlaySettings = GLOBAL_OVERLAY_SETTINGS;

  constructor(@Inject(PLATFORM_ID) private platformId: any,
              private apiService: ApiStrategiesService,
              private authManager: LoginService,
              private socialMedia: SocialMediaStrategyService,
              title: Title,
              meta: Meta,
              activeRoute: ActivatedRoute) {
    super(title, meta, activeRoute);
    this.subs.push(
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
      }),
      this.authManager.applicationUser.subscribe(user => {
        this.authUser = user;
        if (user) {
          this.newComment.userId = user.id;
        }
      })
    );
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
