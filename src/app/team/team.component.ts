import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { BellumgensApiService } from '../services/bellumgens-api.service';
import { CSGOTeam, TeamMember } from '../models/csgoteam';
import { SteamGroup } from '../models/steamuser';
import { LoginService } from '../services/login.service';
import { IgxDialogComponent, IgxToastComponent } from 'igniteui-angular';
import { ApplicationUser } from '../models/applicationuser';
import { Router } from '@angular/router';


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
  @ViewChild('error') public error: IgxToastComponent;
  @ViewChild('saveSuccess') public success: IgxToastComponent;

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
        this.success.show();
      },
      error => {
        if (error.error.Message) {
          this.error.message = error.error.Message;
        }
        this.error.show();
      }
    );
  }

  public createFromForm(): void {
    this.apiService.registerTeam(this.newTeam).subscribe(
      team => {
        this.createTeam.close();
        this.success.show();
      },
      error => {
        if (error.error.Message) {
          this.error.message = error.error.Message;
        }
        this.error.show();
      }
    );
  }
}
