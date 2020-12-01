import { Component } from '@angular/core';
import { ApplicationUser } from '../../../../src-common/models/applicationuser';
import { LoginService } from '../../../../src-common/services/login.service';
import { BellumgensApiService } from '../../../../src-common/services/bellumgens-api.service';
import { CSGOStrategy } from '../../../../src-common/models/csgostrategy';
import { SocialMediaService } from '../../../../src-common/services/social-media.service';
import { CommunicationService } from '../../../../src-common/services/communication.service';

@Component({
  templateUrl: './user-strategies.component.html',
  styleUrls: ['./user-strategies.component.css']
})
export class UserStrategiesComponent {
  public authUser: ApplicationUser;
  public strats: CSGOStrategy [];

  constructor(private authManager: LoginService,
              private socialMedia: SocialMediaService,
              private commService: CommunicationService,
              private apiService: BellumgensApiService) {
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
    this.apiService.deleteStrategy(args.id).subscribe(
      _ => {
        this.strats.splice(this.strats.indexOf(args), 1);
      }
    );
  }

  public shareOnTwitter(strat: CSGOStrategy) {
    this.socialMedia.shareOnTwitter(strat);
  }

}
