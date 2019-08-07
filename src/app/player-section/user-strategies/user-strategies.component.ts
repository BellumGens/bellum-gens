import { Component } from '@angular/core';
import { ApplicationUser } from '../../models/applicationuser';
import { LoginService } from '../../services/login.service';
import { BellumgensApiService } from '../../services/bellumgens-api.service';
import { BaseComponent } from '../../base/base.component';
import { CSGOStrategy } from '../../models/csgostrategy';

@Component({
  selector: 'app-user-strategies',
  templateUrl: './user-strategies.component.html',
  styleUrls: ['./user-strategies.component.css']
})
export class UserStrategiesComponent extends BaseComponent {
  public authUser: ApplicationUser;
  public strats: CSGOStrategy [];

  constructor(private authManager: LoginService,
              private apiService: BellumgensApiService) {
    super();
    this.subs.push(
      this.authManager.applicationUser.subscribe(user => {
        this.authUser = user;
        this.apiService.getUserStrategies(user.id).subscribe(
          strats => this.strats = strats,
          error => this.apiService.emitError(error.error.Message)
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

}
