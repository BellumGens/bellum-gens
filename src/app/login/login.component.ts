import { Component, Input } from '@angular/core';
import { IgxProgressType } from 'igniteui-angular';
import { LoginService } from '../services/login.service';
import { ApplicationUser } from '../models/applicationuser';
import { PlaystyleRole } from '../models/playerrole';
import { BellumgensApiService } from '../services/bellumgens-api.service';
import { BaseComponent } from '../base/base.component';
import { GlobalOverlaySettings } from '../models/misc';
import { TournamentApplication, GAMES } from '../models/tournament';
import { ApiTournamentsService } from '../services/bellumgens-api.tournaments.service';

export interface ProfileCompleteness {
  availability: boolean;
  primaryRole: boolean;
  secondaryRole: boolean;
  mapPool: boolean;
  profileStage: number;
  doneColor: string;
  pendingColor: string;
  doneIcon: string;
  pendingIcon: string;
  progressType: IgxProgressType;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent extends BaseComponent {
  private _authUser: ApplicationUser;
  public registrations: TournamentApplication [];
  public games = GAMES;

  @Input()
  public set authUser(user: ApplicationUser) {
    this._authUser = user;
    if (user) {
      this.tournamentService.registrations.subscribe(data => this.registrations = data);
      this.fillCompleteness();
    }
  }

  public get authUser(): ApplicationUser {
    return this._authUser;
  }

  public profileCompleteness: ProfileCompleteness;

  public overlaySettings = GlobalOverlaySettings;

  constructor(private authManager: LoginService,
              private tournamentService: ApiTournamentsService,
              private apiService: BellumgensApiService) {
    super();
    this.subs.push(
      this.apiService.authUserUpdate.subscribe(_ => this.fillCompleteness())
    );
  }

  public logout() {
    this.authManager.logout();
  }

  private fillCompleteness() {
    this.profileCompleteness = {
      availability: false,
      primaryRole: false,
      secondaryRole: false,
      mapPool: false,
      profileStage: 0,
      doneColor: '#4eb862',
      pendingColor: '#ff134a',
      doneIcon: 'done',
      pendingIcon: 'clear',
      progressType: IgxProgressType.INFO
    };
    if (this._authUser.availability.filter(a => a.Available).length) {
      this.profileCompleteness.availability = true;
      this.profileCompleteness.profileStage++;
    }
    if (this._authUser.primaryRole !== PlaystyleRole.NotSet) {
      this.profileCompleteness.primaryRole = true;
      this.profileCompleteness.profileStage++;
    }
    if (this._authUser.secondaryRole !== PlaystyleRole.NotSet) {
      this.profileCompleteness.secondaryRole = true;
      this.profileCompleteness.profileStage++;
    }
    if (this._authUser.mapPool.filter(m => m.IsPlayed).length) {
      this.profileCompleteness.mapPool = true;
      this.profileCompleteness.profileStage++;
    }
    this.profileCompleteness.progressType = this.profileCompleteness.profileStage <= 1 ? IgxProgressType.DANGER :
                                            this.profileCompleteness.profileStage >= 4 ? IgxProgressType.SUCCESS :
                                            IgxProgressType.WARNING;
  }
}
