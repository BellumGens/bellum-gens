import { Component, HostListener } from '@angular/core';
import { BaseComponent } from '../../../base/base.component';
import { BellumgensApiService } from '../../../services/bellumgens-api.service';
import { ActivatedRoute } from '@angular/router';
import { CSGOStrategy, VoteDirection, newEmptyComment } from '../../../models/csgostrategy';
import { LoginService } from '../../../services/login.service';
import { ApplicationUser } from '../../../models/applicationuser';

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

  constructor(private apiService: BellumgensApiService,
              private authManager: LoginService,
              private route: ActivatedRoute) {
    super();
    this.subs.push(
      this.route.params.subscribe(params => {
        const stratid = params['stratid'];
        if (stratid) {
          this.apiService.getCurrentStrategy(stratid).subscribe(strat => {
            if (strat) {
              this.strat = strat;
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
    this.apiService.submitStratVote(strat, direction, this.authUser.id).subscribe(_ => this.pipeTrigger++);
  }
}
