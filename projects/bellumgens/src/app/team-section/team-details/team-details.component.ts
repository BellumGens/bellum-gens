import { Component, ElementRef, Injector, Signal, inject, signal, viewChildren } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import { IDropDroppedEventArgs, IGX_DRAG_DROP_DIRECTIVES } from '@infragistics/igniteui-angular/directives';
import { IgxAvatarComponent } from '@infragistics/igniteui-angular/avatar';
import { IGX_CARD_DIRECTIVES } from '@infragistics/igniteui-angular/card';
import {
  PlaystyleRole, RoleSlot,
  TeamMember,
  CSGOTeam,
  BellumgensApiService,
  Availability,
  LoginService,
  ApplicationUser,
  AvailabilityComponent,
  ConfirmComponent,
  CountrySVGPipe
} from '../../../../../common/src/public_api';
import { RouterLink, ROUTER_OUTLET_DATA } from '@angular/router';
import { BaseDirective } from '../../base/base.component';

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
  public authUser: Signal<ApplicationUser> = this.authService.applicationUser;
  public teamPractice = signal<Availability []>(null);

  public roleSlots = signal<RoleSlot []>([
    { roleName: 'IGL', role: PlaystyleRole.IGL, user: null },
    { roleName: 'Awper', role: PlaystyleRole.Awper, user: null },
    { roleName: 'Entry Fragger', role: PlaystyleRole.EntryFragger, user: null },
    { roleName: 'Support', role: PlaystyleRole.Support, user: null },
    { roleName: 'Lurker', role: PlaystyleRole.Lurker, user: null }
  ]);

  constructor() {
    super();

    const teamId$ = toObservable(this.team).pipe(
      map(team => team?.teamId),
      filter(teamId => !!teamId),
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
      filter(members => !!members),
      takeUntilDestroyed()
    ).subscribe(members => {
      this.roleSlots.update(slots => slots.map(slot => ({ ...slot, user: members.find(m => m.role === slot.role) || null })));
      this.activeMembers.set(members.filter(m => m.isActive && m.role === PlaystyleRole.NotSet));
      this.inactiveMembers.set(members.filter(m => !m.isActive));
    });
  }

  public removeFromRole(role: RoleSlot) {
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

  public roleDragging(args) {
    if (!this.isAdmin()) {
      args.cancel = true;
    } else {
      this.emptyRoles().filter(e => e.nativeElement.classList.contains('empty-role')).forEach((avatar) => {
        avatar.nativeElement.classList.add('empty-role-active');
      });
    }
  }

  public roleDraggingEnd() {
    this.emptyRoles().forEach((avatar) => {
      avatar.nativeElement.classList.remove('empty-role-active');
    });
  }

  public changeSchedule(day: Availability) {
    this.apiService.setTeamPractice({ ...day, teamId: this.team().teamId }).subscribe();
  }

  private setRoleUser(role: RoleSlot, user: TeamMember) {
    this.roleSlots.update(slots => slots.map(slot => slot.role === role.role ? { ...slot, user } : slot));
  }
}
