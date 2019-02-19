import { Component, OnInit, ViewChildren, QueryList, ElementRef, Input } from '@angular/core';
import { IgxDropEventArgs, IgxAvatarComponent } from 'igniteui-angular';
import { PlaystyleRole, RoleSlot } from 'src/app/models/playerrole';
import { TeamMember, CSGOTeam, TEAM_PLACEHOLDER } from 'src/app/models/csgoteam';
import { ApplicationUser } from 'src/app/models/applicationuser';
import { BellumgensApiService } from 'src/app/services/bellumgens-api.service';
import { Availability } from 'src/app/models/playeravailability';

@Component({
  selector: 'app-team-details',
  templateUrl: './team-details.component.html',
  styleUrls: ['./team-details.component.css']
})
export class TeamDetailsComponent implements OnInit {
  private _team = TEAM_PLACEHOLDER;
  private _isAdmin = null;

  public get team(): CSGOTeam {
    return this._team;
  }

  @Input()
  public set team(team: CSGOTeam) {
    if (this._team.TeamId !== team.TeamId) {
      this._team = team;
      this.roleSlots.forEach((role) => {
        const member = this._team.Members.find(m => m.Role === role.role);
        if (member) {
          role.user = member;
        } else {
          role.user = null;
        }
      });
      this.activeMembers = this._team.Members.filter(m => m.IsActive && m.Role === PlaystyleRole.NotSet);
      this.inactiveMembers = this._team.Members.filter(m => !m.IsActive);
    }
  }
  public activeMembers: TeamMember [];
  public inactiveMembers: TeamMember [];

  @Input()
  public authUser: ApplicationUser;
  public roleSlots: RoleSlot [] = [
    { roleName: 'IGL', role: PlaystyleRole.IGL, user: null },
    { roleName: 'Awper', role: PlaystyleRole.Awper, user: null },
    { roleName: 'Entry Fragger', role: PlaystyleRole.EntryFragger, user: null },
    { roleName: 'Support', role: PlaystyleRole.Support, user: null },
    { roleName: 'Lurker', role: PlaystyleRole.Lurker, user: null }
  ];

  @ViewChildren(IgxAvatarComponent, { read: ElementRef }) public emptyRoles: QueryList<ElementRef>;

  constructor(private apiService: BellumgensApiService) { }

  ngOnInit() {
  }

  public removeFromRole(role: RoleSlot) {
    const user = role.user;
    this.activeMembers.push(user);
    role.user = null;
    user.Role = PlaystyleRole.NotSet;
    this.apiService.updateTeamMember(user).subscribe();
  }

  public removeFromTeam(user: TeamMember) {
    this.apiService.removeTeamMember(user).subscribe();
  }

  public assignToRole(args: IgxDropEventArgs, role: RoleSlot) {
    const user = args.drag.data;
    user.Role = role.role;
    role.user = user;
    this.activeMembers.splice(this.activeMembers.indexOf(args.drag.data), 1);
    args.cancel = true;
    this.roleDraggingEnd();
    this.apiService.updateTeamMember(user).subscribe();
  }

  public get isAdmin() {
    if (this._isAdmin !== null) {
      return this._isAdmin;
    }
    if (!this._team.Members || !this.authUser) {
      return false;
    }
    this._isAdmin = this.team.Members.find(m => m.UserId === this.authUser.SteamUser.steamID64).IsAdmin;
    return this._isAdmin;
  }

  public roleDragging(args) {
    if (!this.isAdmin) {
      args.cancel = true;
    } else {
      this.emptyRoles.filter(e => e.nativeElement.classList.contains('empty-role')).forEach((avatar) => {
        avatar.nativeElement.classList.add('empty-role-active');
      });
    }
  }

  public roleDraggingEnd() {
    this.emptyRoles.forEach((avatar) => {
      avatar.nativeElement.classList.remove('empty-role-active');
    });
  }

  public changeSchedule(day: Availability) {
    this.apiService.setTeamPractice(day).subscribe();
  }
}
