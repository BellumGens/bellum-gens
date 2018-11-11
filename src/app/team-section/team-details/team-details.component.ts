import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IgxDropEventArgs } from 'igniteui-angular';
import { noop } from 'rxjs';
import { PlaystyleRole } from 'src/app/models/playerrole';
import { TeamMember, CSGOTeam, TEAM_PLACEHOLDER } from 'src/app/models/csgoteam';
import { ApplicationUser } from 'src/app/models/applicationuser';
import { SuccessErrorComponent } from 'src/app/success-error/success-error.component';
import { BellumgensApiService } from 'src/app/services/bellumgens-api.service';
import { LoginService } from 'src/app/services/login.service';

interface RoleSlot {
  roleName: string;
  role: PlaystyleRole;
  user: TeamMember;
}

@Component({
  selector: 'app-team-details',
  templateUrl: './team-details.component.html',
  styleUrls: ['./team-details.component.css']
})
export class TeamDetailsComponent implements OnInit {
  public activeMembers: TeamMember [];
  public inactiveMembers: TeamMember [];
  public authUser: ApplicationUser;
  public team: CSGOTeam = TEAM_PLACEHOLDER;
  public roleSlots: RoleSlot [] = [
    { roleName: 'IGL', role: PlaystyleRole.IGL, user: null },
    { roleName: 'Awper', role: PlaystyleRole.Awper, user: null },
    { roleName: 'Entry Fragger', role: PlaystyleRole.EntryFragger, user: null },
    { roleName: 'Support', role: PlaystyleRole.Support, user: null },
    { roleName: 'Lurker', role: PlaystyleRole.Lurker, user: null }
  ];

  @ViewChild(SuccessErrorComponent) public toast: SuccessErrorComponent;

  constructor(private activatedRoute: ActivatedRoute,
    private apiService: BellumgensApiService,
    private authManager: LoginService) {
      this.authManager.applicationUser.subscribe((data: ApplicationUser) => {
        this.authUser = data;
      });

      this.activatedRoute.params.subscribe(params => {
        const teamId = params['teamid'];

        if (teamId) {
          this.apiService.getTeam(teamId).subscribe(team => {
            this.team = team;
            this.roleSlots.forEach((role) => {
              const member = this.team.Members.find(m => m.Role === role.role);
              if (member) {
                role.user = member;
              }
            });
            this.activeMembers = this.team.Members.filter(m => m.IsActive && m.Role === PlaystyleRole.NotSet);
            this.inactiveMembers = this.team.Members.filter(m => !m.IsActive);
          });
        }
      });
    }

  ngOnInit() {
  }

  public removeFromRole(role: RoleSlot) {
    const user = role.user;
    this.activeMembers.push(user);
    role.user = null;
    user.Role = PlaystyleRole.NotSet;
    this.apiService.updateTeamMember(user).subscribe(
      data => noop,
      error => {
        this.toast.showError(error.error.Message);
      }
    );
  }

  public removeFromTeam(user: TeamMember) {
    this.apiService.removeTeamMember(user).subscribe(
      data => noop,
      error => {
        this.toast.showError(error.error.Message);
      }
    );
  }

  public assignToRole(args: IgxDropEventArgs, role: RoleSlot) {
    const user = args.drag.data;
    user.Role = role.role;
    role.user = user;
    this.activeMembers.splice(this.activeMembers.indexOf(args.drag.data), 1);
    args.cancel = true;
    this.apiService.updateTeamMember(user).subscribe(
      data => noop,
      error => {
        this.toast.showError(error.error.Message);
      }
    );
  }

  public get isAdmin() {
    if (!this.team || !this.authUser) {
      return false;
    }
    return this.team.Members.find(m => m.UserId === this.authUser.SteamUser.steamID64).IsAdmin;
  }
}
