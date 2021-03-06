import { Component } from '@angular/core';
import { ApplicationUser } from '../../../../src-common/models/applicationuser';
import { LoginService } from '../../../../src-common/services/login.service';
import { CSGOStrategy } from '../../../../src-common/models/csgostrategy';
import { SocialMediaStrategyService } from '../../../../src-common/services/social-media.strategy.service';
import { CommunicationService } from '../../../../src-common/services/communication.service';
import { ApiStrategiesService } from '../../../../src-common/services/bellumgens-api.strategies.service';

@Component({
  templateUrl: './user-strategies.component.html',
  styleUrls: ['./user-strategies.component.css']
})
export class UserStrategiesComponent {
  public authUser: ApplicationUser;
  public strats: CSGOStrategy [];

  constructor(private authManager: LoginService,
              private socialMedia: SocialMediaStrategyService,
              private commService: CommunicationService,
              private apiService: ApiStrategiesService) {
    this.authManager.applicationUser.subscribe(user => {
      this.authUser = user;
      if (user) {
        this.apiService.getUserStrategies(user.id).subscribe(
          strats => this.strats = strats,
          error => this.commService.emitError(error.error)
        );
      }
    });
  }

  public deleteStrat(args: CSGOStrategy) {
    this.apiService.deleteStrategy(args.id).subscribe(() => this.strats.splice(this.strats.indexOf(args), 1));
  }

  public shareOnTwitter(strat: CSGOStrategy) {
    this.socialMedia.shareOnTwitter(strat);
  }

}
