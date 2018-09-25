import { Component, OnInit, ViewChild } from '@angular/core';
import { PlaystyleRole } from '../models/playerrole';
import { TeamMember, CSGOTeam } from '../models/csgoteam';
import { LoginService } from '../services/login.service';
import { ActivatedRoute } from '@angular/router';
import { BellumgensApiService } from '../services/bellumgens-api.service';
import { ApplicationUser } from '../models/applicationuser';
import { IgxToastComponent, IgxDropEventArgs } from 'igniteui-angular';
import { noop } from 'rxjs';

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
  public team: CSGOTeam;
  public isAdmin = false;
  public roleSlots: RoleSlot [] = [
    { roleName: 'IGL', role: PlaystyleRole.IGL, user: null },
    { roleName: 'Awper', role: PlaystyleRole.Awper, user: null },
    { roleName: 'Entry Fragger', role: PlaystyleRole.EntryFragger, user: null },
    { roleName: 'Support', role: PlaystyleRole.Support, user: null },
    { roleName: 'Lurker', role: PlaystyleRole.Lurker, user: null }
  ];

  @ViewChild('error') public error: IgxToastComponent;
  @ViewChild('saveSuccess') public success: IgxToastComponent;

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
            if (this.authUser) {
              this.isAdmin = this.team.Members.find(m => m.UserId === this.authUser.SteamUser.steamID64).IsAdmin;
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

}
