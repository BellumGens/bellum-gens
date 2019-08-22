import { Component, HostListener, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../base/base.component';
import { BellumgensApiService } from '../../../services/bellumgens-api.service';
import { ActivatedRoute } from '@angular/router';
import { CSGOStrategy, VoteDirection, newEmptyComment, StrategyComment } from '../../../models/csgostrategy';
import { LoginService } from '../../../services/login.service';
import { ApplicationUser } from '../../../models/applicationuser';
import { GlobalOverlaySettings } from '../../../models/misc';
import { LoginDialogComponent } from '../../../login/login-dialog/login-dialog.component';
import { SocialMediaService } from '../../../services/social-media.service';

@Component({
  selector: 'app-strategy-details',
  templateUrl: './strategy-details.component.html',
  styleUrls: ['./strategy-details.component.css']
})
export class StrategyDetailsComponent extends BaseComponent {

  public strat: CSGOStrategy;
  public authUser: ApplicationUser;
  public pipeTrigger = 0;
  public newComment = newEmptyComment();
  public horizontal = window.matchMedia('(min-width: 768px)').matches;
  public overlaySettings = GlobalOverlaySettings;

  @ViewChild(LoginDialogComponent, {static: true})
  public loginDialog: LoginDialogComponent;

  constructor(private apiService: BellumgensApiService,
              private authManager: LoginService,
              private socialMedia: SocialMediaService,
              private route: ActivatedRoute) {
    super();
    this.subs.push(
      this.route.params.subscribe(params => {
        const stratid = params['stratid'];
        if (stratid) {
          this.apiService.getCurrentStrategy(stratid).subscribe(strat => {
            if (strat) {
              this.strat = strat;
              this.newComment.StratId = strat.Id;
            }
          });
        }
      }),
      this.authManager.applicationUser.subscribe(user => {
        this.authUser = user;
        this.newComment.UserId = user.id;
      })
    );
  }

  @HostListener('window:resize')
  public resize() {
    this.horizontal = window.matchMedia('(min-width: 768px)').matches;
  }

  public voteStrat(strat: CSGOStrategy, direction: VoteDirection) {
    if (!this.authUser) {
      this.loginDialog.openLogin('You need to login first');
    } else {
      this.apiService.submitStratVote(strat, direction, this.authUser.id).subscribe(_ => this.pipeTrigger++);
    }
  }

  public submitComment() {
    this.newComment._inEdit = false;
    this.apiService.submitStratComment(this.newComment, this.strat).subscribe(_ => {
      this.newComment = newEmptyComment(this.authUser.id, this.strat.Id);
    });
  }

  public editComment(comment: StrategyComment) {
    this.newComment = comment;
    this.newComment._inEdit = true;
    this.pipeTrigger++;
  }

  public deleteComment(comment: StrategyComment) {
    this.apiService.deleteStratComment(comment, this.strat).subscribe(_ => this.pipeTrigger++);
  }

  public shareOnTwitter(strat: CSGOStrategy) {
    this.socialMedia.shareOnTwitter(strat);
  }
}
