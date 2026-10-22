import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TeamNewComponent } from './team-new.component';
import { ApplicationUser, BellumgensApiService, CSGOTeam, CommunicationService, EMPTY_NEW_TEAM, SteamGroup } from 'bellum-gens-common';
import { Router } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { By } from '@angular/platform-browser';

describe('TeamNewComponent', () => {
  let component: TeamNewComponent;
  let fixture: ComponentFixture<TeamNewComponent>;
  let httpMock: HttpTestingController;
  let apiService: BellumgensApiService;
  let router: Router;

  const mockGroup: SteamGroup = {
    groupID64: "123",
    isPrimary: true,
    groupName: 'Test Group'
  } as SteamGroup;
  const mockGroups: SteamGroup [] = [
    mockGroup,
    { groupID64: '456', groupName: 'Another Clan', avatarFull: 'https://cdn.example.com/clan.png' } as SteamGroup,
    { groupID64: '789', groupName: 'Third Group' } as SteamGroup,
    { groupID64: '000', groupName: 'Fourth Group' } as SteamGroup
  ];
  const mockUser: ApplicationUser = {
    id: '1',
    steamId: 'test-steam-id',
    battleNetId: 'test-battlenet-id',
    username: 'test-user',
    email: 'test-email',
    searchVisible: true,
    steamUserException: false,
    userStatsException: false,
    registered: true,
    externalLogins: []
  };
  const mockTeam: CSGOTeam = {
    teamId: '1',
    teamName: 'Test Team',
    description: 'Test Description',
    teamAvatar: 'test-avatar',
    customUrl: 'test-url',
    visible: true,
    steamGroup: mockGroup
  };

  const groupsUrl = () => `${apiService['_apiEndpoint']}/users/usergroups?userid=${mockUser.steamId}`;
  const el = (): HTMLElement => fixture.nativeElement;
  const listItems = () => el().querySelectorAll('igx-list-item');
  const submitButton = () => el().querySelector('.submit-button') as HTMLButtonElement;
  const form = () => el().querySelector('form') as HTMLFormElement;
  const suffixFor = (selector: string) =>
    (el().querySelector(selector) as HTMLElement).closest('igx-input-group').querySelector('igx-suffix') as HTMLElement;

  const type = async (selector: string, value: string) => {
    const input = el().querySelector(selector) as HTMLInputElement | HTMLTextAreaElement;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('blur'));
    await fixture.whenStable();
  };

  const openWithGroups = async (groups: SteamGroup [] = mockGroups, navigate?: boolean) => {
    if (navigate === undefined) {
      component.open();
    } else {
      component.open(navigate);
    }
    const req = httpMock.expectOne(groupsUrl());
    expect(req.request.method).toBe('GET');
    req.flush(groups);
    await fixture.whenStable();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,

        NoopAnimationsModule,
        TeamNewComponent
      ],
      providers: [provideRouter([]), provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
    })
    .compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
    apiService = TestBed.inject(BellumgensApiService);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('without an authenticated user', () => {
    beforeEach(async () => {
      fixture = TestBed.createComponent(TeamNewComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('should not render the create team dialog', () => {
      expect(component.createTeam()).toBeUndefined();
      expect(el().querySelector('igx-dialog')).toBeNull();
    });
  });

  describe('with an authenticated user', () => {
    beforeEach(async () => {
      fixture = TestBed.createComponent(TeamNewComponent);
      component = fixture.componentInstance;
      fixture.componentRef.setInput('authUser', mockUser);
      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with empty newTeam object', () => {
      expect(component.newTeam).toEqual(EMPTY_NEW_TEAM);
      expect(component.newTeam).not.toBe(EMPTY_NEW_TEAM);
      expect(component.navigateOnCreate).toBe(true);
      expect(component.inProgress()).toBe(false);
    });

    it('should render a collapsed dialog with no groups', () => {
      expect(component.createTeam().isCollapsed).toBe(true);
      expect(el().textContent).toContain('Import from Steam Group');
      expect(el().textContent).toContain('Or create with form');
      expect(listItems().length).toBe(0);
    });

    it('should open the createTeam dialog and load the user Steam groups', async () => {
      await openWithGroups();
      expect(component.createTeam().isCollapsed).toBe(false);
      expect(component.navigateOnCreate).toBe(true);
      expect(component.groups()).toEqual(mockGroups);
    });

    it('should render at most three groups', async () => {
      await openWithGroups();
      const items = listItems();
      expect(items.length).toBe(3);
      expect(items[0].textContent).toContain('Test Group');
      expect(items[1].textContent).toContain('Another Clan');
      expect(items[2].textContent).toContain('Third Group');
    });

    it('should show the empty list message when the user has no groups', async () => {
      await openWithGroups([]);
      expect(listItems().length).toBe(0);
      expect(el().textContent).toContain('No Steam groups found...');
    });

    it('should filter the groups by the search value and clear the search', async () => {
      await openWithGroups();
      expect(suffixFor('#searchGroups')).toBeNull();

      await type('#searchGroups', 'clan');
      expect(component.searchGroups()).toBe('clan');
      expect(listItems().length).toBe(1);
      expect(listItems()[0].textContent).toContain('Another Clan');

      suffixFor('#searchGroups').click();
      await fixture.whenStable();
      expect(component.searchGroups()).toBeNull();
      expect((el().querySelector('#searchGroups') as HTMLInputElement).value).toBe('');
      expect(suffixFor('#searchGroups')).toBeNull();
      expect(listItems().length).toBe(3);
    });

    it('should create a team from a Steam group', () => {
      vi.spyOn(router, 'navigate').mockImplementation(() => undefined);
      component.createFromSteam(mockGroup);
      const req = httpMock.expectOne(`${apiService["_apiEndpoint"]}/teams/team`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockGroup);
      expect(req.request.withCredentials).toBe(true);
      expect(component.inProgress()).toBe(true);
      req.flush(mockTeam);
      expect(component.inProgress()).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/team', mockTeam.customUrl]);
      expect(component.createTeam().isCollapsed).toBe(true);
    });

    it('should create a team when a group list item is clicked', async () => {
      const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
      const success = vi.spyOn(TestBed.inject(CommunicationService), 'emitSuccess');
      await openWithGroups();

      (listItems()[1] as HTMLElement).click();
      await fixture.whenStable();

      const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/teams/team`);
      expect(req.request.body).toEqual(mockGroups[1]);
      expect(submitButton().textContent).toContain('Submitting...');
      req.flush(mockTeam);
      await fixture.whenStable();

      expect(success).toHaveBeenCalledWith('Another Clan registered successfully!');
      expect(component.createTeam().isCollapsed).toBe(true);
      expect(navigate).toHaveBeenCalledWith(['/team', 'test-url']);
      expect(submitButton().textContent).toContain('Submit');
      expect(submitButton().textContent).not.toContain('Submitting...');
    });

    it('should not navigate after creating a team when opened with navigate false', async () => {
      const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
      await openWithGroups(mockGroups, false);
      expect(component.navigateOnCreate).toBe(false);

      component.createFromSteam(mockGroup);
      httpMock.expectOne(`${apiService['_apiEndpoint']}/teams/team`).flush(mockTeam);
      await fixture.whenStable();

      expect(component.inProgress()).toBe(false);
      expect(component.createTeam().isCollapsed).toBe(true);
      expect(navigate).not.toHaveBeenCalled();
    });

    it('should reset the progress and keep the dialog open when registering a Steam group fails', async () => {
      const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
      const error = vi.spyOn(TestBed.inject(CommunicationService), 'emitError');
      await openWithGroups();

      component.createFromSteam(mockGroup);
      expect(component.inProgress()).toBe(true);
      httpMock.expectOne(`${apiService['_apiEndpoint']}/teams/team`)
        .flush('Error', { status: 500, statusText: 'Server Error' });
      await fixture.whenStable();

      expect(error).toHaveBeenCalled();
      expect(component.inProgress()).toBe(false);
      expect(component.createTeam().isCollapsed).toBe(false);
      expect(navigate).not.toHaveBeenCalled();
    });

    it('should create a team from the form', () => {
      vi.spyOn(router, 'navigate').mockImplementation(() => undefined);
      component.newTeam.teamName = 'Test Team';
      component.newTeam.description = 'Test Description';
      component.createFromForm();
      const req = httpMock.expectOne(`${apiService["_apiEndpoint"]}/teams/newteam`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(component.newTeam);
      expect(req.request.withCredentials).toBe(true);
      expect(component.inProgress()).toBe(true);
      req.flush(mockTeam);
      expect(component.inProgress()).toBe(false);
      expect(component.createTeam().isCollapsed).toBe(true);
      expect(router.navigate).toHaveBeenCalledWith(['/team', mockTeam.customUrl]);
    });

    it('should keep the submit button disabled until the form is touched and valid', async () => {
      await openWithGroups();
      expect(submitButton().disabled).toBe(true);

      await type('#teamName', 'T');
      expect(submitButton().disabled).toBe(true);

      await type('#teamName', 'Team Name');
      expect(submitButton().disabled).toBe(true);

      await type('#teamDescripton', 'Our motto');
      expect(submitButton().disabled).toBe(false);
    });

    it('should bind the form fields and clear them via the suffix icons', async () => {
      await openWithGroups();
      expect(suffixFor('#teamName')).toBeNull();
      expect(suffixFor('#teamDescripton')).toBeNull();

      await type('#teamName', 'Team Name');
      await type('#teamDescripton', 'Our motto');
      expect(component.newTeam.teamName).toBe('Team Name');
      expect(component.newTeam.description).toBe('Our motto');

      suffixFor('#teamName').click();
      await fixture.whenStable();
      expect(component.newTeam.teamName).toBeNull();
      expect(suffixFor('#teamName')).toBeNull();

      suffixFor('#teamDescripton').click();
      await fixture.whenStable();
      expect(component.newTeam.description).toBeNull();
      expect(suffixFor('#teamDescripton')).toBeNull();
      expect(submitButton().disabled).toBe(true);
    });

    it('should validate the team avatar url, preview it and clear it', async () => {
      await openWithGroups();
      const avatarGroup = () => (el().querySelector('#teamAvatar') as HTMLElement).closest('igx-input-group');
      expect(avatarGroup().querySelector('igx-prefix igx-icon').textContent).toContain('link');
      expect(avatarGroup().querySelector('igx-hint')).toBeNull();
      expect(suffixFor('#teamAvatar')).toBeNull();

      await type('#teamAvatar', 'not-a-url');
      expect(avatarGroup().querySelector('igx-hint').textContent).toContain('You must provide an image url');
      expect(avatarGroup().querySelector('.team-preview-avatar')).not.toBeNull();

      await type('#teamAvatar', 'https://cdn.example.com/avatars/team.png');
      expect(component.newTeam.teamAvatar).toBe('https://cdn.example.com/avatars/team.png');
      expect(avatarGroup().querySelector('igx-hint')).toBeNull();
      expect(avatarGroup().querySelector('.team-preview-avatar')).not.toBeNull();
      expect(avatarGroup().querySelector('igx-prefix igx-icon')).toBeNull();

      suffixFor('#teamAvatar').click();
      await fixture.whenStable();
      expect(component.newTeam.teamAvatar).toBeNull();
      expect(avatarGroup().querySelector('.team-preview-avatar')).toBeNull();
      expect(avatarGroup().querySelector('igx-prefix igx-icon').textContent).toContain('link');
      expect(suffixFor('#teamAvatar')).toBeNull();
    });

    it('should submit the filled form and navigate to the new team', async () => {
      const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
      const success = vi.spyOn(TestBed.inject(CommunicationService), 'emitSuccess');
      await openWithGroups();
      await type('#teamName', 'Team Name');
      await type('#teamDescripton', 'Our motto');
      await type('#teamAvatar', 'https://cdn.example.com/avatars/team.png');

      form().dispatchEvent(new Event('submit'));
      await fixture.whenStable();

      const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/teams/newteam`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({
        ...EMPTY_NEW_TEAM,
        teamName: 'Team Name',
        description: 'Our motto',
        teamAvatar: 'https://cdn.example.com/avatars/team.png'
      });
      expect(submitButton().disabled).toBe(true);
      expect(submitButton().textContent).toContain('Submitting...');

      req.flush(mockTeam);
      await fixture.whenStable();

      expect(success).toHaveBeenCalledWith('Team Name registered successfully!');
      expect(component.inProgress()).toBe(false);
      expect(component.createTeam().isCollapsed).toBe(true);
      expect(navigate).toHaveBeenCalledWith(['/team', 'test-url']);
    });

    it('should reset the progress and keep the dialog open when registering from the form fails', async () => {
      const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
      const error = vi.spyOn(TestBed.inject(CommunicationService), 'emitError');
      await openWithGroups();
      await type('#teamName', 'Team Name');
      await type('#teamDescripton', 'Our motto');

      form().dispatchEvent(new Event('submit'));
      await fixture.whenStable();
      httpMock.expectOne(`${apiService['_apiEndpoint']}/teams/newteam`)
        .flush('Error', { status: 400, statusText: 'Bad Request' });
      await fixture.whenStable();

      expect(error).toHaveBeenCalled();
      expect(component.inProgress()).toBe(false);
      expect(component.createTeam().isCollapsed).toBe(false);
      expect(submitButton().disabled).toBe(false);
      expect(navigate).not.toHaveBeenCalled();
    });

    it('should render the group avatars in the list', async () => {
      await openWithGroups();
      const avatars = fixture.debugElement.queryAll(By.css('igx-list-item igx-avatar'));
      expect(avatars.length).toBe(3);
    });
  });
});
