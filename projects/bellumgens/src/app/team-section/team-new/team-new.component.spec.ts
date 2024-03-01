import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TeamNewComponent } from './team-new.component';
import { ApplicationUser, BellumgensApiService, CSGOTeam, EMPTY_NEW_TEAM, SteamGroup } from 'bellum-gens-common';
import { Router } from '@angular/router';

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
  const mockUser: ApplicationUser = {
    id: '1',
    steamId: 'test-steam-id',
    battleNetId: 'test-battlenet-id',
    username: 'test-user',
    email: 'test-email',
    avatarFull: 'test-avatar',
    avatarMedium: 'test-avatar',
    avatarIcon: 'test-avatar',
    customURL: 'test-url',
    realname: 'test-realname',
    searchVisible: true,
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

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        NoopAnimationsModule,
        TeamNewComponent
      ]
    })
    .compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
    apiService = TestBed.inject(BellumgensApiService);
    router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamNewComponent);
    component = fixture.componentInstance;
    component.authUser = mockUser;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty newTeam object', () => {
    expect(component.newTeam).toEqual(EMPTY_NEW_TEAM);
  });

  it('should open the createTeam dialog', () => {
    component.open();
    expect(component.createTeam.isCollapsed).toBe(false);
  });

  it('should create a team from a Steam group', () => {
    spyOn(router, 'navigate');
    component.createFromSteam(mockGroup);
    const req = httpMock.expectOne(`${apiService["_apiEndpoint"]}/teams/team`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockGroup);
    expect(req.request.withCredentials).toBeTrue();
    expect(component.inProgress).toBeTrue();
    req.flush(mockTeam);
    expect(component.inProgress).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/team', mockTeam.customUrl]);
    expect(component.createTeam.isCollapsed).toBeTrue();
  });

  it('should create a team from the form', () => {
    spyOn(router, 'navigate');
    component.newTeam.teamName = 'Test Team';
    component.newTeam.description = 'Test Description';
    component.createFromForm();
    const req = httpMock.expectOne(`${apiService["_apiEndpoint"]}/teams/newteam`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(component.newTeam);
    expect(req.request.withCredentials).toBeTrue();
    expect(component.inProgress).toBeTrue();
    req.flush(mockTeam);
    expect(component.inProgress).toBeFalse();
    expect(component.createTeam.isCollapsed).toBeTrue();
    expect(router.navigate).toHaveBeenCalledWith(['/team', mockTeam.customUrl]);
  });
});
