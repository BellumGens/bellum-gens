import { Component, ElementRef, Injector, Signal, computed, inject, linkedSignal, signal, viewChildren } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import { IDragStartEventArgs, IDropDroppedEventArgs, IGX_DRAG_DROP_DIRECTIVES } from '@infragistics/igniteui-angular/directives';
import { IgxAvatarComponent } from '@infragistics/igniteui-angular/avatar';
import { IGX_CARD_DIRECTIVES } from '@infragistics/igniteui-angular/card';
import { PlaystyleRole, RoleSlot, TeamMember, CSGOTeam, Availability, ApplicationUser, Game, teamGame } from 'bellum-gens-common/models';
import { BellumgensApiService, LoginService } from 'bellum-gens-common/services';
import { AvailabilityComponent, ConfirmComponent } from 'bellum-gens-common';
import { CountrySVGPipe } from 'bellum-gens-common/pipes';
import { RouterLink, ROUTER_OUTLET_DATA } from '@angular/router';
import { BaseDirective } from '../../base/base.component';

/** The empty roles of the active roster of a team playing the game. */
export const emptyRoleSlots = (game: Game): RoleSlot [] => {
  const slot = (roleName: string, role: PlaystyleRole): RoleSlot => ({ roleName, role, user: null });
  if (game === Game.Dota2) {
    return [
      slot($localize`:Dota 2 roster position 1|The hero that farms to win the late game@@dota2RoleCarry:Carry`, PlaystyleRole.Carry),
      slot($localize`:Dota 2 roster position 2|The player in the middle lane@@dota2RoleMid:Mid`, PlaystyleRole.Mid),
      slot($localize`:Dota 2 roster position 3|The player in the off lane@@dota2RoleOfflane:Offlane`, PlaystyleRole.Offlane),
      slot($localize`:Dota 2 roster position 4@@dota2RoleSoftSupport:Soft Support`, PlaystyleRole.SoftSupport),
      slot($localize`:Dota 2 roster position 5@@dota2RoleHardSupport:Hard Support`, PlaystyleRole.HardSupport)
    ];
  }
  return [
    slot($localize`:Counter-Strike roster role|The in-game leader@@csRoleIgl:IGL`, PlaystyleRole.IGL),
    slot($localize`:Counter-Strike roster role|The sniper@@csRoleAwper:Awper`, PlaystyleRole.Awper),
    slot($localize`:Counter-Strike roster role|The player first into a bombsite@@csRoleEntryFragger:Entry Fragger`, PlaystyleRole.EntryFragger),
    slot($localize`:Counter-Strike roster role@@csRoleSupport:Support`, PlaystyleRole.Support),
    slot($localize`:Counter-Strike roster role@@csRoleLurker:Lurker`, PlaystyleRole.Lurker)
  ];
};

@Component({
  selector: 'app-team-details',
  templateUrl: './team-details.component.html',
  styleUrls: ['./team-details.component.scss'],
  imports: [
    AvailabilityComponent,
    IGX_CARD_DIRECTIVES,
    IgxAvatarComponent,
    IGX_DRAG_DROP_DIRECTIVES,
    RouterLink,
    ConfirmComponent,
    CountrySVGPipe
  ]
})
export class TeamDetailsComponent extends BaseDirective {
  private apiService = inject(BellumgensApiService);
  private authService = inject(LoginService);
  private injector = inject(Injector);

  public emptyRoles = viewChildren(IgxAvatarComponent, { read: ElementRef });

  // Handed down by the parent TeamComponent through the router outlet.
  public team = inject(ROUTER_OUTLET_DATA) as Signal<CSGOTeam>;

  public isAdmin = signal(false);
  public activeMembers = signal<TeamMember []>([]);
  public inactiveMembers = signal<TeamMember []>([]);
  public authUser: Signal<ApplicationUser | null> = this.authService.applicationUser;
  public teamPractice = signal<Availability [] | null>(null);

  public game = computed(() => teamGame(this.team()));
  /** The tab of the player page with the stats of the team's game. */
  public playerTab = computed(() => this.game() === Game.Dota2 ? 'dota' : 'cs');
  /** A role of the active roster stays empty until a member is assigned to it. */
  public roleSlots = linkedSignal({ source: this.game, computation: game => emptyRoleSlots(game) });

  constructor() {
    super();

    const teamId$ = toObservable(this.team).pipe(
      map(team => team?.teamId),
      filter((teamId): teamId is string => !!teamId),
      distinctUntilChanged()
    );
    teamId$.pipe(
      switchMap(teamId => this.authService.getUserIsTeamAdmin(teamId)),
      takeUntilDestroyed()
    ).subscribe(admin => this.isAdmin.set(admin));
    teamId$.pipe(
      switchMap(teamId => toObservable(this.apiService.getTeamSchedule(teamId), { injector: this.injector })),
      takeUntilDestroyed()
    ).subscribe(schedule => this.teamPractice.set(schedule));
    teamId$.pipe(
      switchMap(teamId => toObservable(this.apiService.getTeamMembers(teamId), { injector: this.injector })),
      filter((members): members is TeamMember [] => !!members),
      takeUntilDestroyed()
    ).subscribe(members => {
      const slots = emptyRoleSlots(this.game());
      this.roleSlots.set(slots.map(slot => ({ ...slot, user: members.find(m => m.role === slot.role) || null })));
      // Active members without a role of this roster sit on the bench
      this.activeMembers.set(members.filter(m => m.isActive && !slots.some(slot => slot.role === m.role)));
      this.inactiveMembers.set(members.filter(m => !m.isActive));
    });
  }

  public removeFromRole(role: RoleSlot) {
    if (!role.user) {
      return;
    }
    const user: TeamMember = { ...role.user, role: PlaystyleRole.NotSet };
    this.setRoleUser(role, null);
    this.activeMembers.update(members => [...members, user]);
    this.apiService.updateTeamMember(user).subscribe();
  }

  public removeFromTeam(user: TeamMember) {
    this.apiService.removeTeamMember(user).subscribe({
      next: () => this.inactiveMembers.update(members => members.filter(m => m.userId !== user.userId)),
      // The service already tells the user; the member just stays in the list
      error: () => {}
    });
  }

  public moveToInactive(user: TeamMember) {
    const inactive: TeamMember = { ...user, isActive: false };
    this.apiService.updateTeamMember(inactive).subscribe();
    this.activeMembers.update(members => members.filter(m => m.userId !== user.userId));
    this.inactiveMembers.update(members => [...members, inactive]);
  }

  public assignToRole(args: IDropDroppedEventArgs, role: RoleSlot) {
    const dragged: TeamMember = args.drag.data;
    const user: TeamMember = { ...dragged, isActive: true, role: role.role };
    this.setRoleUser(role, user);
    this.activeMembers.update(members => members.filter(m => m.userId !== user.userId));
    this.inactiveMembers.update(members => members.filter(m => m.userId !== user.userId));
    args.cancel = true;
    this.roleDraggingEnd();
    this.apiService.updateTeamMember(user).subscribe();
  }

  public roleDragging(args: IDragStartEventArgs) {
    if (!this.isAdmin()) {
      args.cancel = true;
    } else {
      this.emptyRoles().filter(e => e.nativeElement.classList.contains('empty-role')).forEach((avatar) => {
        avatar.nativeElement.classList.add('empty-role-active');
      });
    }
  }

  public removeFromRoleLabel(member: TeamMember) {
    return $localize`Remove ${member.username}:username: from role`;
  }

  public moveToInactiveLabel(member: TeamMember) {
    return $localize`Move ${member.username}:username: to inactive`;
  }

  public removeFromTeamLabel(member: TeamMember) {
    return $localize`Remove ${member.username}:username: from team`;
  }

  public roleDraggingEnd() {
    this.emptyRoles().forEach((avatar) => {
      avatar.nativeElement.classList.remove('empty-role-active');
    });
  }

  public changeSchedule(day: Availability) {
    this.apiService.setTeamPractice({ ...day, teamId: this.team().teamId }).subscribe();
  }

  private setRoleUser(role: RoleSlot, user: TeamMember | null) {
    this.roleSlots.update(slots => slots.map(slot => slot.role === role.role ? { ...slot, user } : slot));
  }
}
