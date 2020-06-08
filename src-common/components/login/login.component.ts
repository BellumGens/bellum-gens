import { Component, Input } from '@angular/core';
import { IgxProgressType } from '@infragistics/igniteui-angular';
import { LoginService } from '../../services/login.service';
import { ApplicationUser } from '../../models/applicationuser';
import { PlaystyleRole } from '../../models/playerrole';
import { BellumgensApiService } from '../../services/bellumgens-api.service';
import { GlobalOverlaySettings } from '../../models/misc';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

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
  selector: 'bg-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private _authUser: ApplicationUser;

  public profileCompleteness: ProfileCompleteness;
  public overlaySettings = GlobalOverlaySettings;
  public userCheck = false;

  @Input()
  public set authUser(user: ApplicationUser) {
    this._authUser = user;
    if (user) {
      this.fillCompleteness();
    }
  }

  public get authUser(): ApplicationUser {
    return this._authUser;
  }

  constructor(private authManager: LoginService,
              private apiService: BellumgensApiService,
              private router: Router) {
    this.authManager.userCheckInProgress.subscribe(value => this.userCheck = value);
    this.apiService.authUserUpdate.subscribe(_ => this.fillCompleteness());
  }

  public logout() {
    this.authManager.logout();
  }

  public navigateToProfile(id: string) {
    if (window.location.href.startsWith(environment.bellumgens)) {
      this.router.navigate(['/players/', id]);
    } else {
      window.location.href = `${environment.bellumgens}/players/${id}`;
    }
  }

  public navigateToStrategies() {
    if (window.location.href.startsWith(environment.bellumgens)) {
      this.router.navigate(['/user/strategies']);
    } else {
      window.location.href = `${environment.bellumgens}/user/strategies`;
    }
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
    this.profileCompleteness.progressType = this.profileCompleteness.profileStage <= 1 ? IgxProgressType.ERROR :
                                            this.profileCompleteness.profileStage >= 4 ? IgxProgressType.SUCCESS :
                                            IgxProgressType.WARNING;
  }
}
