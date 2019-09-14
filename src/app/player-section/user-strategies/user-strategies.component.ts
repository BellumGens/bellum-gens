import { Component } from '@angular/core';
import { ApplicationUser } from '../../models/applicationuser';
import { LoginService } from '../../services/login.service';
import { BellumgensApiService } from '../../services/bellumgens-api.service';
import { BaseComponent } from '../../base/base.component';
import { CSGOStrategy } from '../../models/csgostrategy';
import { SocialMediaService } from '../../services/social-media.service';
import { CommunicationService } from '../../services/communication.service';

@Component({
  selector: 'app-user-strategies',
  templateUrl: './user-strategies.component.html',
  styleUrls: ['./user-strategies.component.css']
})
export class UserStrategiesComponent extends BaseComponent {
  public authUser: ApplicationUser;
  public strats: CSGOStrategy [];

  constructor(private authManager: LoginService,
              private socialMedia: SocialMediaService,
              private commService: CommunicationService,
              private apiService: BellumgensApiService) {
    super();
    this.subs.push(
      this.authManager.applicationUser.subscribe(user => {
        this.authUser = user;
        this.apiService.getUserStrategies(user.id).subscribe(
          strats => this.strats = strats,
          error => this.commService.emitError(error.error.Message)
        );
      })
    );
  }

  public deleteStrat(args: CSGOStrategy) {
    this.apiService.deleteStrategy(args.Id).subscribe(
      _ => {
        this.strats.splice(this.strats.indexOf(args), 1);
      }
    );
  }

  public shareOnTwitter(strat: CSGOStrategy) {
    this.socialMedia.shareOnTwitter(strat);
  }

}
