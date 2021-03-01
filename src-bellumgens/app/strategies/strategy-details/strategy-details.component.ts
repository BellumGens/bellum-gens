import { Component, HostListener } from '@angular/core';
import { BaseComponent } from '../../base/base.component';
import { ActivatedRoute } from '@angular/router';
import { CSGOStrategy, VoteDirection, NEW_EMPTY_COMMENT, StrategyComment } from '../../../../src-common/models/csgostrategy';
import { LoginService } from '../../../../src-common/services/login.service';
import { ApplicationUser } from '../../../../src-common/models/applicationuser';
import { GLOBAL_OVERLAY_SETTINGS } from '../../../../src-common/models/misc';
import { SocialMediaService } from '../../../../src-common/services/social-media.service';
import { Title, Meta } from '@angular/platform-browser';
import { environment } from '../../../../src-common/environments/environment.prod';
import { ApiStrategiesService } from '../../../../src-common/services/bellumgens-api.strategies.service';

@Component({
  selector: 'app-strategy-details',
  templateUrl: './strategy-details.component.html',
  styleUrls: ['./strategy-details.component.scss']
})
export class StrategyDetailsComponent extends BaseComponent {
  public strat: CSGOStrategy;
  public authUser: ApplicationUser;
  public pipeTrigger = 0;
  public newComment = Object.assign({}, NEW_EMPTY_COMMENT);
  public horizontal = window ? window.matchMedia('(min-width: 768px)').matches : true;
  public overlaySettings = GLOBAL_OVERLAY_SETTINGS;

  constructor(private apiService: ApiStrategiesService,
              private authManager: LoginService,
              private socialMedia: SocialMediaService,
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
          this.apiService.getCurrentStrategy(stratid).subscribe(strat => {
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
  }

  @HostListener('window:resize')
  public resize() {
    this.horizontal = window.matchMedia('(min-width: 768px)').matches;
  }

  public openLogin(title?: string) {
    this.authManager.emitOpenLogin(title);
  }

  public voteStrat(strat: CSGOStrategy, direction: VoteDirection) {
    if (!this.authUser) {
      this.openLogin('You need to login first');
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
