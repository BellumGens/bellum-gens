import { Component, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { IDropDroppedEventArgs, IgxAvatarComponent } from '@infragistics/igniteui-angular';
import { PlaystyleRole, RoleSlot } from '../../../../src-common/models/playerrole';
import { TeamMember, TEAM_PLACEHOLDER } from '../../../../src-common/models/csgoteam';
import { BellumgensApiService } from '../../../../src-common/services/bellumgens-api.service';
import { Availability } from '../../../../src-common/models/playeravailability';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../../base/base.component';
import { LoginService } from '../../../../src-common/services/login.service';
import { ApplicationUser } from '../../../../src-common/models/applicationuser';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-team-details',
  templateUrl: './team-details.component.html',
  styleUrls: ['./team-details.component.css']
})
export class TeamDetailsComponent extends BaseComponent {
  public isAdmin = false;
  public teamMembers: TeamMember [];
  public activeMembers: TeamMember [];
  public inactiveMembers: TeamMember [];
  public authUser: ApplicationUser;
  public team = TEAM_PLACEHOLDER;
  public teamPractice: Availability [];

  public roleSlots: RoleSlot [] = [
    { roleName: 'IGL', role: PlaystyleRole.IGL, user: null },
    { roleName: 'Awper', role: PlaystyleRole.Awper, user: null },
    { roleName: 'Entry Fragger', role: PlaystyleRole.EntryFragger, user: null },
    { roleName: 'Support', role: PlaystyleRole.Support, user: null },
    { roleName: 'Lurker', role: PlaystyleRole.Lurker, user: null }
  ];

  @ViewChildren(IgxAvatarComponent, { read: ElementRef }) public emptyRoles: QueryList<ElementRef>;

  constructor(private apiService: BellumgensApiService,
              private authService: LoginService,
              title: Title,
              meta: Meta,
              activeRoute: ActivatedRoute) {
    super(title, meta, activeRoute);

    this.subs.push(
      this.authService.applicationUser.subscribe((data: ApplicationUser) => {
        this.authUser = data;
      }),
      this.activeRoute.parent.params.subscribe(params => {
        const teamId = params['teamid'];

        if (teamId) {
          this.apiService.getTeam(teamId).subscribe(team => {
            if (team) {
              this.team = team;
              this.authService.getUserIsTeamAdmin(team.teamId).subscribe(admin => this.isAdmin = admin);

              this.apiService.getTeamSchedule(team.teamId).subscribe(schedule => this.teamPractice = schedule);
              this.apiService.getTeamMembers(team.teamId).subscribe(members => {
                if (members) {
                  this.teamMembers = members;
                  this.roleSlots.forEach((role) => {
                    const member = this.teamMembers.find(m => m.role === role.role);
                    if (member) {
                      role.user = member;
                    } else {
                      role.user = null;
                    }
                  });
                  this.activeMembers = this.teamMembers.filter(m => m.isActive && m.role === PlaystyleRole.NotSet);
                  this.inactiveMembers = this.teamMembers.filter(m => !m.isActive);
                }
              });
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
    user.role = PlaystyleRole.NotSet;
    this.apiService.updateTeamMember(user).subscribe();
  }

  public removeFromTeam(user: TeamMember) {
    this.apiService.removeTeamMember(user).subscribe();
  }

  public moveToInactive(user: TeamMember) {
    user.isActive = false;
    this.apiService.updateTeamMember(user).subscribe();
    this.activeMembers.splice(this.activeMembers.indexOf(user), 1);
    this.inactiveMembers.push(user);
  }

  public assignToRole(args: IDropDroppedEventArgs, role: RoleSlot) {
    args.drag.data.IsActive = true;

    const user = args.drag.data;
    user.Role = role.role;
    role.user = user;
    if (this.activeMembers.find(m => m.userId === args.drag.data.UserId)) {
      this.activeMembers.splice(this.activeMembers.indexOf(args.drag.data), 1);
    } else {
      this.inactiveMembers.splice(this.activeMembers.indexOf(args.drag.data), 1);
    }
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
