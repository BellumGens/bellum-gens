import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamDetailsComponent } from './team-details.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ActivatedRoute, ROUTER_OUTLET_DATA, provideRouter } from '@angular/router';
import { Observable, config, of, throwError } from 'rxjs';
import { WritableSignal, signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import type { Mock } from 'vitest';
import {
  ApplicationUser,
  Availability,
  BellumgensApiService,
  CSGOTeam,
  ConfirmComponent,
  DayOfWeek,
  LoginService,
  PlaystyleRole,
  TEAM_PLACEHOLDER,
  TeamMember
} from '../../../../../common/src/public_api';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { IDropDroppedEventArgs } from '@infragistics/igniteui-angular/directives';

const TEAM: CSGOTeam = {
  teamId: 'team-1',
  teamName: 'Test Team',
  teamAvatar: '',
  customUrl: 'test-team',
  visible: true
} as CSGOTeam;

const member = (userId: string, overrides: Partial<TeamMember> = {}): TeamMember => ({
  teamId: TEAM.teamId,
  userId,
  steamId: `steam-${userId}`,
  isActive: true,
  isAdmin: false,
  isEditor: false,
  role: PlaystyleRole.NotSet,
  username: `user-${userId}`,
  avatarIcon: '',
  avatarMedium: '',
  avatarFull: '',
  customUrl: '',
  country: '',
  realName: '',
  ...overrides
});

describe('TeamDetailsComponent', () => {
  let component: TeamDetailsComponent;
  let fixture: ComponentFixture<TeamDetailsComponent>;
  let team: WritableSignal<CSGOTeam>;

  beforeEach(async () => {
    team = signal(TEAM_PLACEHOLDER);
    await TestBed.configureTestingModule({
      imports: [

        NoopAnimationsModule,
        ServiceWorkerModule.register('', { enabled: false }),
        TeamDetailsComponent
      ],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {
              params: new Observable()
            },
            data: new Observable()
          }
        },
        { provide: ROUTER_OUTLET_DATA, useValue: team },
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    }).compileComponents();
  });

  describe('with the team placeholder', () => {
    let apiService: BellumgensApiService;
    let loginService: LoginService;

    beforeEach(() => {
      apiService = TestBed.inject(BellumgensApiService);
      loginService = TestBed.inject(LoginService);
      vi.spyOn(apiService, 'getTeamMembers');
      vi.spyOn(apiService, 'getTeamSchedule');
      vi.spyOn(loginService, 'getUserIsTeamAdmin');
      fixture = TestBed.createComponent(TeamDetailsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with team placeholder', () => {
      expect(component.team()).toBeDefined();
      expect(component.team().teamName).toBe('Create or view teams');
    });

    it('should initialize isAdmin as false', () => {
      expect(component.isAdmin()).toBe(false);
    });

    it('should have 5 role slots', () => {
      expect(component.roleSlots()).toBeDefined();
      expect(component.roleSlots().length).toBe(5);
    });

    it('should have role slots with correct names', () => {
      const roleNames = component.roleSlots().map(slot => slot.roleName);
      expect(roleNames).toContain('IGL');
      expect(roleNames).toContain('Awper');
      expect(roleNames).toContain('Entry Fragger');
      expect(roleNames).toContain('Support');
      expect(roleNames).toContain('Lurker');
    });

    it('should not load admin status, schedule or members for a team without an id', async () => {
      await fixture.whenStable();
      expect(loginService.getUserIsTeamAdmin).not.toHaveBeenCalled();
      expect(apiService.getTeamSchedule).not.toHaveBeenCalled();
      expect(apiService.getTeamMembers).not.toHaveBeenCalled();
    });

    it('should render five empty role slots and empty bench / inactive lists', async () => {
      await fixture.whenStable();
      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelectorAll('.member-slot').length).toBe(5);
      expect(el.querySelectorAll('.empty-role').length).toBe(5);
      expect(el.textContent).toContain('Bench is currently empty.');
      expect(el.textContent).toContain('No inactive members.');
      expect(el.querySelectorAll('.active-inactive-users').length).toBe(0);
    });

    it('should render nothing but the confirm dialog when there is no team', async () => {
      team.set(null);
      await fixture.whenStable();
      const el: HTMLElement = fixture.nativeElement;
      expect(el.querySelector('.overview-container')).toBeNull();
      expect(el.querySelector('bg-confirm')).not.toBeNull();
    });
  });

  describe('with a team', () => {
    let apiService: BellumgensApiService;
    let loginService: LoginService;
    let members: WritableSignal<TeamMember []>;
    let schedule: WritableSignal<Availability []>;
    let updateTeamMember: Mock;
    let removeTeamMember: Mock;
    let setTeamPractice: Mock;

    const igl = member('igl', { role: PlaystyleRole.IGL, username: 'Leader', country: 'bg', customUrl: 'leader' });
    const awper = member('awper', { role: PlaystyleRole.Awper, username: 'Sniper' });
    const benchA = member('bench-a');
    const benchB = member('bench-b');
    const inactiveA = member('inactive-a', { isActive: false });
    const inactiveB = member('inactive-b', { isActive: false });
    const allMembers = [igl, awper, benchA, benchB, inactiveA, inactiveB];

    const practice: Availability [] = [
      { day: DayOfWeek.Monday, available: true, from: new Date(2020, 0, 1, 18), to: new Date(2020, 0, 1, 22) }
    ];

    const setup = async (options: { admin?: boolean, teamMembers?: TeamMember [], user?: Partial<ApplicationUser> } = {}) => {
      apiService = TestBed.inject(BellumgensApiService);
      loginService = TestBed.inject(LoginService);
      members = signal(options.teamMembers === undefined ? allMembers : options.teamMembers);
      schedule = signal(practice);
      loginService['_applicationUser'].set((options.user ?? { id: 'me' }) as ApplicationUser);
      vi.spyOn(loginService, 'getUserIsTeamAdmin').mockReturnValue(of(!!options.admin));
      vi.spyOn(apiService, 'getTeamMembers').mockReturnValue(members);
      vi.spyOn(apiService, 'getTeamSchedule').mockReturnValue(schedule);
      updateTeamMember = vi.spyOn(apiService, 'updateTeamMember').mockImplementation(m => of(m)) as Mock;
      removeTeamMember = vi.spyOn(apiService, 'removeTeamMember').mockReturnValue(of({})) as Mock;
      setTeamPractice = vi.spyOn(apiService, 'setTeamPractice').mockReturnValue(of({})) as Mock;

      team.set(TEAM);
      fixture = TestBed.createComponent(TeamDetailsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    };

    const text = () => (fixture.nativeElement as HTMLElement).textContent;
    const byTitle = (title: string) => Array.from((fixture.nativeElement as HTMLElement).querySelectorAll(`igx-avatar[title="${title}"]`)) as HTMLElement [];
    const slot = (role: PlaystyleRole) => component.roleSlots().find(s => s.role === role);
    const ids = (list: TeamMember []) => list.map(m => m.userId);
    const dropArgs = (dragged: TeamMember) => ({ drag: { data: dragged }, cancel: false }) as unknown as IDropDroppedEventArgs;

    describe('data loading', () => {
      it('should load admin status, schedule and members for the team id', async () => {
        await setup();
        expect(loginService.getUserIsTeamAdmin).toHaveBeenCalledWith(TEAM.teamId);
        expect(apiService.getTeamSchedule).toHaveBeenCalledWith(TEAM.teamId);
        expect(apiService.getTeamMembers).toHaveBeenCalledWith(TEAM.teamId);
        expect(component.teamPractice()).toEqual(practice);
      });

      it('should split members into role slots, bench and inactive lists', async () => {
        await setup();
        expect(slot(PlaystyleRole.IGL).user).toEqual(igl);
        expect(slot(PlaystyleRole.Awper).user).toEqual(awper);
        expect(slot(PlaystyleRole.EntryFragger).user).toBeNull();
        expect(slot(PlaystyleRole.Support).user).toBeNull();
        expect(slot(PlaystyleRole.Lurker).user).toBeNull();
        expect(ids(component.activeMembers())).toEqual(['bench-a', 'bench-b']);
        expect(ids(component.inactiveMembers())).toEqual(['inactive-a', 'inactive-b']);
      });

      it('should render role users, bench and inactive members', async () => {
        await setup();
        const el: HTMLElement = fixture.nativeElement;
        const leaderLink = Array.from(el.querySelectorAll('.member-slot a')).find(a => a.textContent.trim() === 'Leader');
        expect(leaderLink.getAttribute('href')).toBe('/players/leader');
        expect(text()).toContain('Sniper');
        expect(el.querySelectorAll('.empty-role').length).toBe(3);
        expect(text().match(/\[ empty \]/g).length).toBe(3);
        expect(el.querySelectorAll('.active-inactive-users').length).toBe(4);
        expect(text()).toContain('user-bench-a');
        expect(text()).toContain('user-inactive-b');
        const benchLink = Array.from(el.querySelectorAll('.active-inactive-users a')).find(a => a.textContent.trim() === 'user-bench-a');
        expect(benchLink.getAttribute('href')).toBe('/players/bench-a');
        expect(text()).not.toContain('Bench is currently empty.');
        expect(text()).not.toContain('No inactive members.');
      });

      it('should wait for members to arrive before splitting them', async () => {
        await setup({ teamMembers: null });
        expect(component.activeMembers()).toEqual([]);
        expect(slot(PlaystyleRole.IGL).user).toBeNull();

        members.set(allMembers);
        await fixture.whenStable();
        expect(slot(PlaystyleRole.IGL).user).toEqual(igl);
        expect(ids(component.activeMembers())).toEqual(['bench-a', 'bench-b']);
      });

      it('should show empty placeholders for a team without members', async () => {
        await setup({ teamMembers: [] });
        expect(component.roleSlots().every(s => s.user === null)).toBe(true);
        expect(text()).toContain('Bench is currently empty.');
        expect(text()).toContain('No inactive members.');
      });

      it('should reload when the team changes, but not for the same team id', async () => {
        await setup();
        team.set({ ...TEAM });
        await fixture.whenStable();
        expect(apiService.getTeamMembers).toHaveBeenCalledTimes(1);

        team.set({ ...TEAM, teamId: 'team-2' });
        await fixture.whenStable();
        expect(loginService.getUserIsTeamAdmin).toHaveBeenLastCalledWith('team-2');
        expect(apiService.getTeamSchedule).toHaveBeenLastCalledWith('team-2');
        expect(apiService.getTeamMembers).toHaveBeenLastCalledWith('team-2');
        expect(apiService.getTeamMembers).toHaveBeenCalledTimes(2);
      });
    });

    describe('non-admin rendering', () => {
      beforeEach(async () => {
        await setup({ admin: false });
      });

      it('should not render admin controls', () => {
        expect(component.isAdmin()).toBe(false);
        expect(byTitle('Remove from role').length).toBe(0);
        expect(byTitle('Move to inactive').length).toBe(0);
        expect(byTitle('Remove from team').length).toBe(0);
        expect(text()).not.toContain('Drag players to add them to the active roster');
      });

      it('should show the country badge for role users with a country', () => {
        expect(byTitle('bg').length).toBe(1);
      });

      it('should cancel dragging members', () => {
        const args = { cancel: false };
        const dragged = fixture.debugElement.query(By.css('.active-inactive-users igx-avatar'));
        dragged.triggerEventHandler('dragStart', args);
        expect(args.cancel).toBe(true);
      });
    });

    describe('admin rendering', () => {
      beforeEach(async () => {
        await setup({ admin: true, user: { id: 'inactive-b' } });
      });

      it('should render admin controls instead of country badges', () => {
        expect(component.isAdmin()).toBe(true);
        expect(byTitle('Remove from role').length).toBe(2);
        expect(byTitle('Move to inactive').length).toBe(2);
        expect(byTitle('bg').length).toBe(0);
        expect(text()).toContain('Drag players to add them to the active roster');
      });

      it('should not offer removing the current user from the team', () => {
        const removable = byTitle('Remove from team');
        expect(removable.length).toBe(1);
        expect(removable[0].closest('.active-inactive-users').textContent).toContain('user-inactive-a');
      });

      it('should highlight empty role slots while dragging and clear them when dragging ends', () => {
        const dragged = fixture.debugElement.query(By.css('.active-inactive-users igx-avatar'));
        const args = { cancel: false };
        dragged.triggerEventHandler('dragStart', args);
        expect(args.cancel).toBe(false);
        const el: HTMLElement = fixture.nativeElement;
        expect(el.querySelectorAll('.empty-role.empty-role-active').length).toBe(3);
        expect(el.querySelectorAll('.empty-role-active:not(.empty-role)').length).toBe(0);

        dragged.triggerEventHandler('dragEnd', {});
        expect(el.querySelectorAll('.empty-role-active').length).toBe(0);
      });
    });

    describe('role assignment', () => {
      beforeEach(async () => {
        await setup({ admin: true });
      });

      it('should send the bench member to the server with the dropped role and active flag', async () => {
        const args = dropArgs(benchB);
        const drop = fixture.debugElement.queryAll(By.css('.empty-role'))[0];
        drop.triggerEventHandler('dropped', args);
        await fixture.whenStable();

        expect(args.cancel).toBe(true);
        expect(updateTeamMember).toHaveBeenCalledTimes(1);
        const payload: TeamMember = updateTeamMember.mock.calls[0][0];
        expect(payload).toEqual({ ...benchB, isActive: true, role: PlaystyleRole.EntryFragger });
        expect(Object.keys(payload)).not.toContain('Role');
        expect(Object.keys(payload)).not.toContain('IsActive');

        expect(slot(PlaystyleRole.EntryFragger).user).toEqual(payload);
        expect(ids(component.activeMembers())).toEqual(['bench-a']);
        expect(ids(component.inactiveMembers())).toEqual(['inactive-a', 'inactive-b']);
        expect(text()).toContain('user-bench-b');
        expect(fixture.nativeElement.querySelectorAll('.empty-role').length).toBe(2);
      });

      it('should activate an inactive member dropped into a role and remove only that member from the inactive list', () => {
        component.assignToRole(dropArgs(inactiveA), slot(PlaystyleRole.Lurker));

        const payload: TeamMember = updateTeamMember.mock.calls[0][0];
        expect(payload).toEqual({ ...inactiveA, isActive: true, role: PlaystyleRole.Lurker });
        expect(Object.keys(payload)).not.toContain('Role');
        expect(Object.keys(payload)).not.toContain('IsActive');
        expect(slot(PlaystyleRole.Lurker).user.userId).toBe('inactive-a');
        expect(ids(component.inactiveMembers())).toEqual(['inactive-b']);
        expect(ids(component.activeMembers())).toEqual(['bench-a', 'bench-b']);
      });

      it('should clear drag highlighting after a drop', () => {
        component.roleDragging({ cancel: false });
        expect(fixture.nativeElement.querySelectorAll('.empty-role-active').length).toBe(3);
        component.assignToRole(dropArgs(benchA), slot(PlaystyleRole.Support));
        expect(fixture.nativeElement.querySelectorAll('.empty-role-active').length).toBe(0);
      });

      it('should move a role user back to the bench when removed from the role', async () => {
        const removeFromRole = byTitle('Remove from role')[0];
        removeFromRole.click();
        await fixture.whenStable();

        expect(updateTeamMember).toHaveBeenCalledWith({ ...igl, role: PlaystyleRole.NotSet });
        expect(slot(PlaystyleRole.IGL).user).toBeNull();
        expect(ids(component.activeMembers())).toEqual(['bench-a', 'bench-b', 'igl']);
        expect(component.activeMembers()[2].role).toBe(PlaystyleRole.NotSet);
        expect(byTitle('Move to inactive').length).toBe(3);
      });
    });

    describe('active / inactive', () => {
      beforeEach(async () => {
        await setup({ admin: true });
      });

      it('should move a bench member to the inactive list', async () => {
        byTitle('Move to inactive')[0].click();
        await fixture.whenStable();

        expect(updateTeamMember).toHaveBeenCalledWith({ ...benchA, isActive: false });
        expect(ids(component.activeMembers())).toEqual(['bench-b']);
        expect(ids(component.inactiveMembers())).toEqual(['inactive-a', 'inactive-b', 'bench-a']);
        expect(component.inactiveMembers()[2].isActive).toBe(false);
        expect(byTitle('Remove from team').length).toBe(3);
      });

      it('should show the empty bench message once the last bench member is moved out', async () => {
        component.moveToInactive(benchA);
        component.moveToInactive(benchB);
        await fixture.whenStable();
        expect(text()).toContain('Bench is currently empty.');
      });
    });

    describe('remove from team', () => {
      afterEach(() => {
        config.onUnhandledError = null;
      });

      it('should remove the member through the confirm dialog after the delete succeeds', async () => {
        await setup({ admin: true });
        byTitle('Remove from team')[1].click();
        await fixture.whenStable();
        expect(removeTeamMember).not.toHaveBeenCalled();

        const confirm = fixture.debugElement.query(By.directive(ConfirmComponent)).componentInstance as ConfirmComponent;
        confirm.okClicked();
        await fixture.whenStable();

        expect(removeTeamMember).toHaveBeenCalledWith(inactiveB);
        expect(ids(component.inactiveMembers())).toEqual(['inactive-a']);
        expect(text()).not.toContain('user-inactive-b');
      });

      it('should show the empty inactive message after removing the last inactive member', async () => {
        await setup({ admin: true });
        component.removeFromTeam(inactiveA);
        component.removeFromTeam(inactiveB);
        await fixture.whenStable();
        expect(text()).toContain('No inactive members.');
      });

      it('should keep the member and handle the error when the delete fails', async () => {
        await setup({ admin: true });
        const unhandled = vi.fn();
        config.onUnhandledError = unhandled;
        removeTeamMember.mockReturnValue(throwError(() => new Error('delete failed')));

        component.removeFromTeam(inactiveA);
        await fixture.whenStable();
        // RxJS reports unhandled errors from a timer, so give it one macrotask
        await new Promise(resolve => setTimeout(resolve));

        expect(unhandled).not.toHaveBeenCalled();

        expect(removeTeamMember).toHaveBeenCalledWith(inactiveA);
        expect(ids(component.inactiveMembers())).toEqual(['inactive-a', 'inactive-b']);
        expect(text()).toContain('user-inactive-a');
      });
    });

    describe('schedule', () => {
      it('should save a changed practice day for the team', async () => {
        await setup({ admin: true });
        const day: Availability = { day: DayOfWeek.Friday, available: true, from: new Date(2020, 0, 1, 19), to: new Date(2020, 0, 1, 23) };
        fixture.debugElement.query(By.css('bg-availability')).triggerEventHandler('availabilityChanged', day);

        expect(setTeamPractice).toHaveBeenCalledWith({ ...day, teamId: TEAM.teamId });
      });

      it('should update the practice schedule when the service signal changes', async () => {
        await setup();
        const updated: Availability [] = [
          { day: DayOfWeek.Tuesday, available: true, from: new Date(2020, 0, 1, 17), to: new Date(2020, 0, 1, 21) }
        ];
        schedule.set(updated);
        await fixture.whenStable();
        expect(component.teamPractice()).toEqual(updated);
      });
    });
  });
});
