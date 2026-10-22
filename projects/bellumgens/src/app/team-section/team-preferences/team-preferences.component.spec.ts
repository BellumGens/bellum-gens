import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamPreferencesComponent } from './team-preferences.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, ROUTER_OUTLET_DATA, provideRouter } from '@angular/router';
import { WritableSignal, signal } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ApplicationUser,
  BellumgensApiService,
  CSGOTeam,
  LoginService,
  PlaystyleRole,
  TEAM_PLACEHOLDER,
  TeamMember
} from '../../../../../common/src/public_api';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { IgxSwitchComponent } from '@infragistics/igniteui-angular/switch';

const TEAM: CSGOTeam = {
  teamId: 'team-1',
  teamName: 'Test Team',
  teamAvatar: 'https://cdn.example.com/avatars/team.png',
  description: 'A test team',
  discord: 'https://discord.gg/test',
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

describe('TeamPreferencesComponent', () => {
  let component: TeamPreferencesComponent;
  let fixture: ComponentFixture<TeamPreferencesComponent>;
  let team: WritableSignal<CSGOTeam>;

  beforeEach(async () => {
    team = signal(TEAM_PLACEHOLDER);
    await TestBed.configureTestingModule({
      imports: [

        NoopAnimationsModule,
        ServiceWorkerModule.register('', { enabled: false }),
        TeamPreferencesComponent
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

    beforeEach(() => {
      apiService = TestBed.inject(BellumgensApiService);
      vi.spyOn(apiService, 'getTeamMembers');
      fixture = TestBed.createComponent(TeamPreferencesComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize authUser', () => {
      expect(component.authUser()).toBeDefined();
    });

    it('should initialize team property with TEAM_PLACEHOLDER', () => {
      expect(component.team()).toBeDefined();
      expect(component.team()).toEqual(TEAM_PLACEHOLDER);
    });

    it('should not load members or render the form for a team without an id', async () => {
      await fixture.whenStable();
      expect(apiService.getTeamMembers).not.toHaveBeenCalled();
      expect(component.teammembers()).toBeUndefined();
      expect(fixture.nativeElement.querySelector('form')).toBeNull();
    });

    it('should render nothing when there is no team', async () => {
      team.set(null);
      await fixture.whenStable();
      expect(apiService.getTeamMembers).not.toHaveBeenCalled();
      expect(fixture.nativeElement.querySelector('form')).toBeNull();
    });
  });

  describe('with a team', () => {
    let apiService: BellumgensApiService;
    let httpMock: HttpTestingController;
    let members: WritableSignal<TeamMember []>;

    const me = member('me', { isAdmin: true, isEditor: true, username: 'Me' });
    const player = member('player', { username: 'Player', realName: 'Real Player', country: 'bg', customUrl: 'the-player' });
    const editor = member('editor', { isEditor: true, username: 'Editor' });

    const setup = async (options: { teamMembers?: TeamMember [], user?: Partial<ApplicationUser> | null, team?: CSGOTeam } = {}) => {
      apiService = TestBed.inject(BellumgensApiService);
      httpMock = TestBed.inject(HttpTestingController);
      members = signal(options.teamMembers === undefined ? [me, player, editor].map(m => ({ ...m })) : options.teamMembers);
      if (options.user !== null) {
        TestBed.inject(LoginService)['_applicationUser'].set((options.user ?? { id: 'me' }) as ApplicationUser);
      }
      vi.spyOn(apiService, 'getTeamMembers').mockReturnValue(members);

      team.set({ ...(options.team ?? TEAM) });
      fixture = TestBed.createComponent(TeamPreferencesComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
      // ngModel writes its value asynchronously, so let the inputs settle and re-render
      fixture.detectChanges();
      await fixture.whenStable();
    };

    const el = () => fixture.nativeElement as HTMLElement;
    const input = (id: string) => el().querySelector(`#${id}`) as HTMLInputElement;
    const suffix = (id: string) => input(id).closest('igx-input-group').querySelector('igx-suffix button') as HTMLButtonElement;
    const listItems = () => Array.from(el().querySelectorAll('igx-list-item')) as HTMLElement [];
    const switchFor = (prefix: string, index: number) =>
      fixture.debugElement.query(By.css(`#${prefix}_switch_${index}`)).componentInstance as IgxSwitchComponent;
    const toggle = async (prefix: string, index: number) => {
      (el().querySelector(`#${prefix}_switch_${index} input`) as HTMLInputElement).click();
      await fixture.whenStable();
    };
    const type = async (id: string, value: string) => {
      const field = input(id);
      field.value = value;
      field.dispatchEvent(new Event('input'));
      field.dispatchEvent(new Event('blur'));
      await fixture.whenStable();
    };
    const submitButton = () => el().querySelector('button.submit-button') as HTMLButtonElement;

    describe('data loading', () => {
      it('should load the team members for the team id', async () => {
        await setup();
        expect(apiService.getTeamMembers).toHaveBeenCalledWith(TEAM.teamId);
        expect(component.teammembers().map(m => m.userId)).toEqual(['me', 'player', 'editor']);
      });

      it('should update when the members signal changes', async () => {
        await setup({ teamMembers: null });
        expect(component.teammembers()).toBeNull();
        expect(listItems().length).toBe(0);

        members.set([{ ...player }]);
        await fixture.whenStable();
        expect(component.teammembers()).toEqual([player]);
        expect(listItems().length).toBe(1);
      });

      it('should reload only when the team id changes', async () => {
        await setup();
        team.set({ ...TEAM, teamName: 'Renamed' });
        await fixture.whenStable();
        expect(apiService.getTeamMembers).toHaveBeenCalledTimes(1);

        team.set({ ...TEAM, teamId: 'team-2' });
        await fixture.whenStable();
        expect(apiService.getTeamMembers).toHaveBeenCalledTimes(2);
        expect(apiService.getTeamMembers).toHaveBeenLastCalledWith('team-2');
      });
    });

    describe('team info form', () => {
      it('should render the team info in the form', async () => {
        await setup();
        expect(input('teamName').value).toBe(TEAM.teamName);
        expect(input('teamAvatar').value).toBe(TEAM.teamAvatar);
        expect(input('teamDescription').value).toBe(TEAM.description);
        expect(input('teamDiscord').value).toBe(TEAM.discord);
        expect(el().querySelectorAll('form igx-suffix').length).toBe(4);
        expect(el().querySelector('igx-hint')).toBeNull();
      });

      it('should not render clear suffixes for empty fields', async () => {
        await setup({ team: { ...TEAM, teamName: '', teamAvatar: '', description: '', discord: '' } });
        expect(el().querySelectorAll('form igx-suffix').length).toBe(0);
      });

      it('should edit the team in place when typing', async () => {
        await setup();
        await type('teamName', 'New Name');
        await type('teamDescription', 'New description');
        await type('teamDiscord', 'new-discord');
        expect(component.team().teamName).toBe('New Name');
        expect(component.team().description).toBe('New description');
        expect(component.team().discord).toBe('new-discord');
      });

      it('should render the clear actions as named buttons that do not submit the form', async () => {
        await setup();
        for (const [id, name] of [
          ['teamName', 'Clear team name'],
          ['teamAvatar', 'Clear team avatar URL'],
          ['teamDescription', 'Clear description'],
          ['teamDiscord', 'Clear Discord']
        ]) {
          expect(suffix(id).type).toBe('button');
          expect(suffix(id).getAttribute('aria-label')).toBe(name);
        }
      });

      it('should clear the team name, description and discord through the suffixes', async () => {
        await setup();
        suffix('teamName').click();
        suffix('teamDescription').click();
        suffix('teamDiscord').click();
        await fixture.whenStable();
        expect(component.team().teamName).toBeNull();
        expect(component.team().description).toBeNull();
        expect(component.team().discord).toBeNull();
      });

      it('should clear the team avatar through the suffix', async () => {
        await setup();
        suffix('teamAvatar').click();
        await fixture.whenStable();
        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.team().teamAvatar).toBeNull();
        expect(suffix('teamAvatar')).toBeNull();
      });

      it('should render the form for a team without an avatar', async () => {
        await setup({ team: { ...TEAM, teamAvatar: null } });
        expect(input('teamAvatar').value).toBe('');
        expect(suffix('teamAvatar')).toBeNull();
        expect(el().querySelectorAll('form igx-suffix').length).toBe(3);
      });

      it('should toggle the team visibility in place', async () => {
        await setup();
        (el().querySelector('#teamVisibility input') as HTMLInputElement).click();
        await fixture.whenStable();
        expect(component.team().visible).toBe(false);
      });

      it('should show a hint for an invalid avatar url', async () => {
        await setup();
        await type('teamAvatar', 'not-an-image');
        fixture.detectChanges();
        expect(component.team().teamAvatar).toBe('not-an-image');
        expect(el().querySelector('igx-hint').textContent).toContain('You must provide an image url');
      });

      it('should keep the submit button disabled until the form is touched', async () => {
        await setup();
        expect(submitButton().disabled).toBe(true);
        await type('teamName', 'New Name');
        fixture.detectChanges();
        expect(submitButton().disabled).toBe(false);
      });

      it('should disable the submit button when the form is invalid', async () => {
        await setup();
        await type('teamName', 'X');
        fixture.detectChanges();
        expect(submitButton().disabled).toBe(true);
      });

      it('should send the edited team to the server on submit', async () => {
        await setup();
        await type('teamName', 'New Name');
        fixture.detectChanges();
        submitButton().click();
        await fixture.whenStable();

        const req = httpMock.expectOne(r => r.url.includes('/teams/team'));
        expect(req.request.method).toBe('PUT');
        expect(req.request.withCredentials).toBe(true);
        expect(req.request.body).toEqual({ ...TEAM, teamName: 'New Name' });
        req.flush(req.request.body);
      });
    });

    describe('team member roles', () => {
      it('should render a list item per member with a link to the player', async () => {
        await setup();
        const items = listItems();
        expect(items.length).toBe(3);
        expect(items[0].textContent).toContain('Me');
        const links = items.map(i => i.querySelector('a').getAttribute('href'));
        expect(links).toEqual(['/players/me', '/players/the-player', '/players/editor']);
        expect(items[1].textContent).toContain('Real Player');
      });

      it('should show a country badge only for members with a country', async () => {
        await setup();
        const badges = el().querySelectorAll('igx-avatar.country-badge-small');
        expect(badges.length).toBe(1);
        expect(badges[0].getAttribute('title')).toBe('bg');
        expect(listItems()[1].contains(badges[0])).toBe(true);
      });

      it('should reflect admin and editor status in the switches', async () => {
        await setup();
        expect(switchFor('admin', 0).checked).toBe(true);
        expect(switchFor('editor', 0).checked).toBe(true);
        expect(switchFor('admin', 1).checked).toBe(false);
        expect(switchFor('editor', 1).checked).toBe(false);
        expect(switchFor('admin', 2).checked).toBe(false);
        expect(switchFor('editor', 2).checked).toBe(true);
      });

      it('should not allow the current user to change their own roles', async () => {
        await setup();
        expect(switchFor('admin', 0).disabled).toBe(true);
        expect(switchFor('editor', 0).disabled).toBe(true);
        expect(switchFor('admin', 1).disabled).toBe(false);
        expect(switchFor('editor', 1).disabled).toBe(false);
      });

      it('should disable the editor switch for admins', async () => {
        await setup({ user: { id: 'someone-else' } });
        expect(switchFor('admin', 0).disabled).toBe(false);
        expect(switchFor('editor', 0).disabled).toBe(true);
        expect(switchFor('editor', 2).disabled).toBe(false);
      });

      it('should enable all admin switches when there is no authenticated user', async () => {
        await setup({ user: null });
        httpMock.match(() => true);
        expect(component.authUser()).toBeNull();
        expect(switchFor('admin', 0).disabled).toBe(false);
      });

      it('should make a member an admin and strategist when the admin switch is turned on', async () => {
        await setup();
        await toggle('admin', 1);

        const req = httpMock.expectOne(r => r.url.includes('/teams/member'));
        expect(req.request.method).toBe('PUT');
        expect(req.request.withCredentials).toBe(true);
        expect(req.request.body).toEqual({ ...player, isAdmin: true, isEditor: true });
        req.flush(req.request.body);

        fixture.detectChanges();
        await fixture.whenStable();
        expect(component.teammembers()[1].isAdmin).toBe(true);
        expect(component.teammembers()[1].isEditor).toBe(true);
        expect(switchFor('editor', 1).disabled).toBe(true);
      });

      it('should keep strategist status when the admin switch is turned off', async () => {
        await setup({ user: { id: 'someone-else' } });
        await toggle('admin', 0);

        const req = httpMock.expectOne(r => r.url.includes('/teams/member'));
        expect(req.request.body).toEqual({ ...me, isAdmin: false, isEditor: true });
        req.flush(req.request.body);
      });

      it('should update strategist status when the editor switch is toggled', async () => {
        await setup();
        await toggle('editor', 1);

        const req = httpMock.expectOne(r => r.url.includes('/teams/member'));
        expect(req.request.method).toBe('PUT');
        expect(req.request.body).toEqual({ ...player, isEditor: true });
        req.flush(req.request.body);

        await toggle('editor', 2);
        const second = httpMock.expectOne(r => r.url.includes('/teams/member'));
        expect(second.request.body).toEqual({ ...editor, isEditor: false });
        second.flush(second.request.body);
      });
    });
  });
});
