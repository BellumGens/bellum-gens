import { Component, ViewEncapsulation, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BellumgensApiService } from '../services/bellumgens-api.service';
import { CSGOTeam, TeamMember } from '../models/csgoteam';
import { SteamUser, SteamGroup } from '../models/steamuser';
import { LoginService } from '../services/login.service';
import { IgxDialogComponent, IgxToastComponent, IgxDropEventArgs } from 'igniteui-angular';
import { PlaystyleRole } from '../models/playerrole';
import { noop } from 'rxjs';

interface RoleSlot {
  roleName: string;
  role: PlaystyleRole;
  user: TeamMember;
}

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class TeamComponent {
  public searchGroups: string;
  public team: CSGOTeam;
  public newTeam: CSGOTeam = {
    TeamName: '',
    TeamAvatar: '',
    TeamId: undefined,
    Members: undefined
  };
  public activeMembers: TeamMember [];
  public inactiveMembers: TeamMember [];
  public authUser: SteamUser;
  public isAdmin = false;
  public roleSlots: RoleSlot [] = [
    { roleName: 'IGL', role: PlaystyleRole.IGL, user: null },
    { roleName: 'Awper', role: PlaystyleRole.Awper, user: null },
    { roleName: 'Entry Fragger', role: PlaystyleRole.EntryFragger, user: null },
    { roleName: 'Support', role: PlaystyleRole.Support, user: null },
    { roleName: 'Lurker', role: PlaystyleRole.Lurker, user: null }
  ];

  @ViewChild(IgxDialogComponent) public createTeam: IgxDialogComponent;
  @ViewChild('error') public error: IgxToastComponent;
  @ViewChild('saveSuccess') public success: IgxToastComponent;

  constructor(private activatedRoute: ActivatedRoute,
              private apiService: BellumgensApiService,
              private authManager: LoginService) {
    this.authManager.steamUser.subscribe((data: SteamUser) => {
      this.authUser = data;
    });
    this.activatedRoute.params.subscribe(params => {
      const teamId = params['teamid'];

      if (teamId) {
        this.apiService.getTeam(teamId).subscribe(team => {
          this.team = team;
          if (this.authUser) {
            this.isAdmin = this.team.Members.find(m => m.UserId === this.authUser.steamID64).IsAdmin;
          }
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

  public removeFromRole(role: RoleSlot) {
    const user = role.user;
    this.activeMembers.push(user);
    role.user = null;
    user.Role = PlaystyleRole.NotSet;
    this.apiService.updateTeamMember(user).subscribe(
      data => noop,
      error => {
        if (error.error.Message) {
          this.error.message = error.error.Message;
        }
        this.error.show();
      }
    );
  }

  public removeFromTeam(user: TeamMember) {
    this.apiService.removeTeamMember(user).subscribe(
      data => noop,
      error => {
        if (error.error.Message) {
          this.error.message = error.error.Message;
        }
        this.error.show();
      }
    );
  }

  public assignToRole(args: IgxDropEventArgs) {
    const roleSlot = this.roleSlots.filter(r => r.user === null)[0];
    const user = args.drag.data;
    user.Role = roleSlot.role;
    roleSlot.user = user;
    this.activeMembers.splice(this.activeMembers.indexOf(args.drag.data), 1);
    args.cancel = true;
    this.apiService.updateTeamMember(user).subscribe(
      data => noop,
      error => {
        if (error.error.Message) {
          this.error.message = error.error.Message;
        }
        this.error.show();
      }
    );
  }

  public createFromSteam(group: SteamGroup): void {
    this.apiService.registerSteamGroup(group).subscribe(
      team => {
        this.team = team;
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
        this.team = team;
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
