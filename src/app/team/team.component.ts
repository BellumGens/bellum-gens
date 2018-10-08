import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { BellumgensApiService } from '../services/bellumgens-api.service';
import { CSGOTeam, TeamMember } from '../models/csgoteam';
import { SteamGroup } from '../models/steamuser';
import { LoginService } from '../services/login.service';
import { IgxDialogComponent, IgxToastComponent } from 'igniteui-angular';
import { ApplicationUser } from '../models/applicationuser';
import { Router } from '@angular/router';
import { SuccessErrorComponent } from '../success-error/success-error.component';


@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TeamComponent {
  public searchGroups: string;
  public newTeam: CSGOTeam = {
    TeamName: '',
    TeamAvatar: '',
    TeamId: undefined,
    Members: undefined
  };
  public activeMembers: TeamMember [];
  public inactiveMembers: TeamMember [];
  public authUser: ApplicationUser;

  @ViewChild(IgxDialogComponent) public createTeam: IgxDialogComponent;
  @ViewChild(SuccessErrorComponent) public toast: SuccessErrorComponent;

  constructor(private apiService: BellumgensApiService,
              public router: Router,
              private authManager: LoginService) {
    this.authManager.applicationUser.subscribe((data: ApplicationUser) => {
      this.authUser = data;
    });
  }

  public createFromSteam(group: SteamGroup): void {
    this.apiService.registerSteamGroup(group).subscribe(
      team => {
        this.createTeam.close();
        this.authUser.Teams.push(team);
        this.toast.showSuccess(group.groupName + ' team successfully created!');
      },
      error => {
        this.toast.showError(error.error.Message);
      }
    );
  }

  public createFromForm(): void {
    this.apiService.registerTeam(this.newTeam).subscribe(
      team => {
        this.createTeam.close();
        this.authUser.Teams.push(team);
        this.toast.showSuccess(this.newTeam.TeamName + ' team successfully created!');
      },
      error => {
        this.toast.showError(error.error.Message);
      }
    );
  }

  public abandonTeam(team: CSGOTeam) {
    this.authUser.Teams.splice(this.authUser.Teams.indexOf(team), 1);
    this.apiService.abandonTeam(team.TeamId).subscribe(
      data => {
        this.toast.showSuccess('You are no longer part of ' + team.TeamName);
      },
      error => {
        this.toast.showError(error.error.Message);
      }
    );
  }
}
