import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { CSGOTeam, TeamMember } from 'src/app/models/csgoteam';
import { ApplicationUser } from 'src/app/models/applicationuser';
import { IgxDialogComponent } from 'igniteui-angular';
import { SuccessErrorComponent } from 'src/app/success-error/success-error.component';
import { BellumgensApiService } from 'src/app/services/bellumgens-api.service';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { SteamGroup } from 'src/app/models/steamuser';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  public searchGroups: string;
  public newTeam: CSGOTeam = {
    TeamName: '',
    TeamAvatar: '',
    Description: '',
    TeamId: undefined,
    PracticeSchedule: [],
    Members: undefined
  };
  public activeMembers: TeamMember [];
  public inactiveMembers: TeamMember [];

  @Input()
  public authUser: ApplicationUser;

  @ViewChild(IgxDialogComponent) public createTeam: IgxDialogComponent;
  @ViewChild(SuccessErrorComponent) public toast: SuccessErrorComponent;

  constructor(private apiService: BellumgensApiService,
              public router: Router) {
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
