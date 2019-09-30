import { Component, ViewChildren, QueryList, ElementRef, Input } from '@angular/core';
import { IDropDroppedEventArgs, IgxAvatarComponent } from 'igniteui-angular';
import { PlaystyleRole, RoleSlot } from '../../models/playerrole';
import { TeamMember, TEAM_PLACEHOLDER } from '../../models/csgoteam';
import { BellumgensApiService } from '../../services/bellumgens-api.service';
import { Availability } from '../../models/playeravailability';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../../base/base.component';
import { LoginService } from '../../services/login.service';
import { ApplicationUser } from '../../models/applicationuser';

@Component({
  selector: 'app-team-details',
  templateUrl: './team-details.component.html',
  styleUrls: ['./team-details.component.css']
})
export class TeamDetailsComponent extends BaseComponent {
  private _isAdmin = null;
  public activeMembers: TeamMember [];
  public inactiveMembers: TeamMember [];
  public authUser: ApplicationUser;
  public team = TEAM_PLACEHOLDER;

  public get isAdmin() {
    if (this._isAdmin !== null) {
      return this._isAdmin;
    }
    if (this.authUser && this.team && this.team.Members) {
      this._isAdmin = this.team.Members.filter(m => m.IsAdmin && m.UserId === this.authUser.id).length > 0;
    }
    return this._isAdmin;
  }

  public roleSlots: RoleSlot [] = [
    { roleName: 'IGL', role: PlaystyleRole.IGL, user: null },
    { roleName: 'Awper', role: PlaystyleRole.Awper, user: null },
    { roleName: 'Entry Fragger', role: PlaystyleRole.EntryFragger, user: null },
    { roleName: 'Support', role: PlaystyleRole.Support, user: null },
    { roleName: 'Lurker', role: PlaystyleRole.Lurker, user: null }
  ];

  @ViewChildren(IgxAvatarComponent, { read: ElementRef }) public emptyRoles: QueryList<ElementRef>;

  constructor(private apiService: BellumgensApiService,
              private authManager: LoginService,
              private activatedRoute: ActivatedRoute) {
    super();
    this.subs.push(
      this.authManager.applicationUser.subscribe((data: ApplicationUser) => {
        this.authUser = data;
      }),
      this.activatedRoute.parent.params.subscribe(params => {
        const teamId = params['teamid'];

        if (teamId) {
          this.apiService.getTeam(teamId).subscribe(team => {
            if (team) {
              this.team = team;
              this.roleSlots.forEach((role) => {
                const member = this.team.Members.find(m => m.Role === role.role);
                if (member) {
                  role.user = member;
                } else {
                  role.user = null;
                }
              });
              this.activeMembers = this.team.Members.filter(m => m.IsActive && m.Role === PlaystyleRole.NotSet);
              this.inactiveMembers = this.team.Members.filter(m => !m.IsActive);
            }
          });
        }
      })
    );
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

  public assignToRole(args: IDropDroppedEventArgs, role: RoleSlot) {
    const user = args.drag.data;
    user.Role = role.role;
    role.user = user;
    this.activeMembers.splice(this.activeMembers.indexOf(args.drag.data), 1);
    args.cancel = true;
    this.roleDraggingEnd();
    this.apiService.updateTeamMember(user).subscribe();
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
