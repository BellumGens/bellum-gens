import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { BellumgensApiService } from './bellumgens-api.service';
import { SteamGroup, SteamUser } from '../models/steamuser';
import { CSGOTeam, TeamMember, TeamApplication } from '../models/csgoteam';
import { Availability, DayOfWeek } from '../models/playeravailability';
import { PlaystyleRole, Role } from '../models/playerrole';
import { CSGOMap, CSGOMapPool } from '../models/csgomaps';
import { NotificationState, UserNotification } from '../models/usernotifications';
import { CommunicationService } from './communication.service';
import { CSGOPlayer } from '../public_api';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';


describe('BellumgensApiService', () => {
  let service: BellumgensApiService;
  let httpMock: HttpTestingController;
  let commsService: CommunicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(BellumgensApiService);
    httpMock = TestBed.inject(HttpTestingController);
    commsService = TestBed.inject(CommunicationService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('getUserTeams should send a GET request to the correct URL', () => {
    const userId = '123';
    service.getUserTeams(userId).subscribe();
    const req = httpMock.expectOne(`${service['_apiEndpoint']}/users/userteams?userid=${userId}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBe(true);
    req.flush({});
  });

  it('teamApplications should send a GET request to the correct URL', () => {
    const teamId = '456';
    const applications: TeamApplication [] = [{ applicantId: '678', teamId: '456', message: 'Test Application', state: NotificationState.NotSeen }];
    service.teamApplications(teamId).subscribe(data => expect(data).toEqual(applications));
    const req = httpMock.expectOne(`${service['_apiEndpoint']}/teams/applications?teamId=${teamId}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBe(true);
    req.flush(applications);
  });

  it('getTeam should send a GET request to the correct URL', () => {
    const teamId = '789';
    const mockteam: CSGOTeam = { teamId: '789', teamName: 'Test Team', visible: true, teamAvatar: 'test.jpg' };
    service.getTeam(teamId).subscribe();
    expect(service['_teamReqInProgress']).toBe(true);
    const req = httpMock.expectOne(`${service['_apiEndpoint']}/teams?teamid=${teamId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockteam);
    expect(service['_teamReqInProgress']).toBe(false);
    expect(service['_currentTeam'].value).toEqual(mockteam);
  });

  it('getTeamMembers should send a GET request to the correct URL', () => {
    const teamId = '012';
    const teamMembers: TeamMember [] = [{
      teamId: '012',
      userId: '123',
      steamId: '123456789',
      isActive: true,
      isAdmin: false,
      isEditor: false,
      role: PlaystyleRole.Awper,
      username: 'Test User',
      avatarIcon: 'test.jpg',
      avatarMedium: 'test.jpg',
      avatarFull: 'test.jpg',
      customUrl: 'test',
      country: 'DE',
      realName: 'Test User'
    }];
    service.getTeamMembers(teamId).subscribe();
    const req = httpMock.expectOne(`${service['_apiEndpoint']}/teams/members?teamid=${teamId}`);
    expect(req.request.method).toBe('GET');
    req.flush(teamMembers);
    expect(service['_currentTeamMembers'].value).toEqual(teamMembers);
  });

  it('getTeamSchedule should send a GET request to the correct URL', () => {
    const teamId = '345';
    const availability: Availability[] = [{
      teamId: '345',
      day: DayOfWeek.Monday,
      available: true,
      from: new Date(),
      to: new Date()
    }];
    service.getTeamSchedule(teamId).subscribe();
    const req = httpMock.expectOne(`${service['_apiEndpoint']}/teams/availability?teamid=${teamId}`);
    expect(req.request.method).toBe('GET');
    req.flush(availability);
    expect(service['_currentTeamPractice'].value).toEqual(availability);
  });

  it('registerSteamGroup should send a POST request to the correct URL', () => {
    const group: SteamGroup = {
      groupID64: '678',
      groupName: 'Test Group',
      isPrimary: true,
      avatarFull: 'test.jpg',
      avatarMedium: 'test.jpg',
      avatarIcon: 'test.jpg',
      members: []
    };
    commsService.success.subscribe(success => expect(success).toBe(`${group.groupName} registered successfully!`));
    service.registerSteamGroup(group).subscribe();
    const req = httpMock.expectOne(`${service['_apiEndpoint']}/teams/team`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(group);
    expect(req.request.withCredentials).toBe(true);
    req.flush({});

    const errorMessage = `Http failure response for ${service['_apiEndpoint']}/teams/team: 500 Steam Group already registered!`;
    commsService.error.subscribe(error => expect(error).toBe(errorMessage));
    service.registerSteamGroup(group).subscribe({
      error: err => expect(err.message).toBe(errorMessage)
    });
    const req2 = httpMock.expectOne(`${service['_apiEndpoint']}/teams/team`);
    expect(req2.request.method).toBe('POST');
    expect(req2.request.body).toEqual(group);
    expect(req2.request.withCredentials).toBe(true);
    req2.error(new ProgressEvent('Server Error'), { status: 500, statusText: 'Steam Group already registered!' });
  });

  it('registerTeam should send a POST request to the correct URL', () => {
    const team: CSGOTeam = { teamId: '901', teamName: 'Test Team', visible: true, teamAvatar: 'test.jpg' };
    commsService.success.subscribe(success => expect(success).toBe(`${team.teamName} registered successfully!`));
    service.registerTeam(team).subscribe();
    const req = httpMock.expectOne(`${service['_apiEndpoint']}/teams/newteam`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(team);
    expect(req.request.withCredentials).toBe(true);
    req.flush(team);

    const errorMessage = `Http failure response for ${service['_apiEndpoint']}/teams/newteam: 500 Team already registered!`;
    commsService.error.subscribe(error => expect(error).toBe(errorMessage));
    service.registerTeam(team).subscribe({
      error: err => expect(err.message).toBe(errorMessage)
    });
    const req2 = httpMock.expectOne(`${service['_apiEndpoint']}/teams/newteam`);
    expect(req2.request.method).toBe('POST');
    expect(req2.request.body).toEqual(team);
    expect(req2.request.withCredentials).toBe(true);
    req2.error(new ProgressEvent('Server Error'), { status: 500, statusText: 'Team already registered!' });
  });

  it('updateTeam should send a PUT request to the correct URL', () => {
    const team: CSGOTeam = { teamId: '234', teamName: 'Test Team', visible: true, teamAvatar: 'test.jpg' };
    commsService.success.subscribe(success => expect(success).toBe(`${team.teamName} updated successfully!`));
    service.updateTeam(team).subscribe();
    const req = httpMock.expectOne(`${service['_apiEndpoint']}/teams/team`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(team);
    expect(req.request.withCredentials).toBe(true);
    req.flush({});

    const errorMessage = `Http failure response for ${service['_apiEndpoint']}/teams/team: 404 Team not found!`;
    commsService.error.subscribe(error => expect(error).toBe(errorMessage));
    service.updateTeam(team).subscribe({
      error: err => expect(err.message).toBe(errorMessage)
    });
    const req2 = httpMock.expectOne(`${service['_apiEndpoint']}/teams/team`);
    expect(req2.request.method).toBe('PUT');
    expect(req2.request.body).toEqual(team);
    expect(req2.request.withCredentials).toBe(true);
    req2.error(new ProgressEvent('Not Found'), { status: 404, statusText: 'Team not found!' });
  });

  it('updateTeamMember should send a PUT request to the correct URL', () => {
    const teamMember: TeamMember = {
      teamId: '567',
      userId: '123',
      steamId: '123456789',
      isActive: true,
      isAdmin: false,
      isEditor: false,
      role: PlaystyleRole.Awper,
      username: 'Test User',
      avatarIcon: 'test.jpg',
      avatarMedium: 'test.jpg',
      avatarFull: 'test.jpg',
      customUrl: 'test',
      country: 'DE',
      realName: 'Test User'
    };
    commsService.success.subscribe(success => expect(success).toBe(`${teamMember.username} updated successfully!`));
    service.updateTeamMember(teamMember).subscribe();
    const req = httpMock.expectOne(`${service['_apiEndpoint']}/teams/member`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(teamMember);
    expect(req.request.withCredentials).toBe(true);
    req.flush({});

    const errorMessage = `Http failure response for ${service['_apiEndpoint']}/teams/member: 404 Team member not found!`;
    commsService.error.subscribe(error => expect(error).toBe(errorMessage));
    service.updateTeamMember(teamMember).subscribe({
      error: err => expect(err.message).toBe(errorMessage)
    });
    const req2 = httpMock.expectOne(`${service['_apiEndpoint']}/teams/member`);
    expect(req2.request.method).toBe('PUT');
    expect(req2.request.body).toEqual(teamMember);
    expect(req2.request.withCredentials).toBe(true);
    req2.error(new ProgressEvent('Not Found'), { status: 404, statusText: 'Team member not found!' });
  });

  it('removeTeamMember should send a DELETE request to the correct URL', () => {
    const teamMember: TeamMember = {
      teamId: '123',
      userId: '456',
      steamId: '123456789',
      isActive: true,
      isAdmin: false,
      isEditor: false,
      role: PlaystyleRole.EntryFragger,
      username: 'Test User',
      avatarIcon: 'test.jpg',
      avatarMedium: 'test.jpg',
      avatarFull: 'test.jpg',
      customUrl: 'test',
      country: 'DE',
      realName: 'Test User'
    };
    commsService.success.subscribe(success => expect(success).toBe(`${teamMember.username} removed from team!`));
    service.removeTeamMember(teamMember).subscribe();
    const req = httpMock.expectOne(`${service['_apiEndpoint']}/teams/removemember?teamId=${teamMember.teamId}&userId=${teamMember.userId}`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.withCredentials).toBe(true);
    req.flush({});

    const errorMessage = `Http failure response for ${service['_apiEndpoint']}/teams/removemember?teamId=${teamMember.teamId}&userId=${teamMember.userId}: 404 Team member not found!`;
    commsService.error.subscribe(error => expect(error).toBe(errorMessage));
    service.removeTeamMember(teamMember).subscribe({
      error: err => expect(err.message).toBe(errorMessage)
    });
    const req2 = httpMock.expectOne(`${service['_apiEndpoint']}/teams/removemember?teamId=${teamMember.teamId}&userId=${teamMember.userId}`);
    expect(req2.request.method).toBe('DELETE');
    expect(req2.request.withCredentials).toBe(true);
    req2.error(new ProgressEvent('Not Found'), { status: 404, statusText: 'Team member not found!' });
  });

  it('abandonTeam should send a DELETE request to the correct URL', () => {
    const team: CSGOTeam = { teamId: '123', teamName: 'Test Team', visible: true, teamAvatar: 'test.jpg' };
    commsService.success.subscribe(success => expect(success).toBe(`You're are no longer part of ${team.teamName}`));
    service.abandonTeam(team).subscribe();
    const req = httpMock.expectOne(`${service['_apiEndpoint']}/teams/abandon?teamId=${team.teamId}`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.withCredentials).toBe(true);
    req.flush({});

    const errorMessage = `Http failure response for ${service['_apiEndpoint']}/teams/abandon?teamId=${team.teamId}: 500 Could not remove team because there is an active tournament registration associated with it!`;
    commsService.error.subscribe(error => expect(error).toBe(errorMessage));
    service.abandonTeam(team).subscribe({
      error: err => expect(err.message).toBe(errorMessage)
    });
    const req2 = httpMock.expectOne(`${service['_apiEndpoint']}/teams/abandon?teamId=${team.teamId}`);
    expect(req2.request.method).toBe('DELETE');
    expect(req2.request.withCredentials).toBe(true);
    req2.error(new ProgressEvent('Server Error'), { status: 500, statusText: 'Could not remove team because there is an active tournament registration associated with it!' });
  });

  it('inviteToTeam should send a POST request to the correct URL', () => {
    const steamUser: SteamUser = {
      steamID: '456',
      steamID64: '2352345',
      avatarIcon: 'test.jpg',
      avatarMedium: 'test.jpg',
      avatarFull: 'test.jpg',
      realname: 'Test User',
      location: 'Test Location',
      country: 'DE',
      summary: 'Test Summary',
      customURL: 'test',
      groups: []
    };
    const team: CSGOTeam = { teamId: '789', teamName: 'Test Team', visible: true, teamAvatar: 'test.jpg' };
    commsService.success.subscribe(success => expect(success).toBe(`${steamUser.steamID} successfully invited to ${team.teamName}`));
    service.inviteToTeam(steamUser, team).subscribe();
    const req = httpMock.expectOne(`${service['_apiEndpoint']}/teams/invite`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({userId: steamUser.steamID64, teamId: team.teamId});
    expect(req.request.withCredentials).toBe(true);
    req.flush({});

    const errorMessage = `Http failure response for ${service['_apiEndpoint']}/teams/invite: 500 Could not invite user to team!`;
    commsService.error.subscribe(error => expect(error).toBe(errorMessage));
    service.inviteToTeam(steamUser, team).subscribe({
      error: err => expect(err.message).toBe(errorMessage)
    });
    const req2 = httpMock.expectOne(`${service['_apiEndpoint']}/teams/invite`);
    expect(req2.request.method).toBe('POST');
    expect(req2.request.body).toEqual({userId: steamUser.steamID64, teamId: team.teamId});
    expect(req2.request.withCredentials).toBe(true);
    req2.error(new ProgressEvent('Server Error'), { status: 500, statusText: 'Could not invite user to team!' });
  });

  it('submitApplication should send a POST request to the correct URL', () => {
    const application: TeamApplication = { applicantId: '012', teamId: '123', message: 'Test Application', state: NotificationState.NotSeen };
    commsService.success.subscribe(success => expect(success).toBe('Application submitted successfully!'));
    service.submitApplication(application).subscribe();
    const req = httpMock.expectOne(`${service['_apiEndpoint']}/teams/apply`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(application);
    expect(req.request.withCredentials).toBe(true);
    req.flush({});

    const errorMessage = `Http failure response for ${service['_apiEndpoint']}/teams/apply: 500 Could not submit application!`;
    commsService.error.subscribe(error => expect(error).toBe(errorMessage));
    service.submitApplication(application).subscribe({
      error: err => expect(err.message).toBe(errorMessage)
    });
    const req2 = httpMock.expectOne(`${service['_apiEndpoint']}/teams/apply`);
    expect(req2.request.method).toBe('POST');
    expect(req2.request.body).toEqual(application);
    expect(req2.request.withCredentials).toBe(true);
    req2.error(new ProgressEvent('Server Error'), { status: 500, statusText: 'Could not submit application!' });
  });

  it('getTeamApplications should send a GET request to the correct URL', () => {
    const teamId = '345';
    service.getTeamApplications(teamId).subscribe();
    const req = httpMock.expectOne(`${service['_apiEndpoint']}/teams/applications?teamId=${teamId}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBe(true);
    req.flush({});
  });

  it('approveApplication should send a PUT request to the correct URL', () => {
    const application: TeamApplication = { applicantId: '678', teamId: '456', message: 'Test Application', state: NotificationState.NotSeen };
    commsService.success.subscribe(success => expect(success).toBe(`${application.userName} is now part of your team!`));
    service.approveApplication(application).subscribe();
    const req = httpMock.expectOne(`${service['_apiEndpoint']}/teams/approveapplication`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(application);
    expect(req.request.withCredentials).toBe(true);
    req.flush({});

    const errorMessage = `Http failure response for ${service['_apiEndpoint']}/teams/approveapplication: 500 Could not approve application!`;
    commsService.error.subscribe(error => expect(error).toBe(errorMessage));
    service.approveApplication(application).subscribe({
      error: err => expect(err.message).toBe(errorMessage)
    });
    const req2 = httpMock.expectOne(`${service['_apiEndpoint']}/teams/approveapplication`);
    expect(req2.request.method).toBe('PUT');
    expect(req2.request.body).toEqual(application);
    expect(req2.request.withCredentials).toBe(true);
    req2.error(new ProgressEvent('Server Error'), { status: 500, statusText: 'Could not approve application!' });
  });

  it('rejectApplication should send a PUT request to the correct URL', () => {
    const application: TeamApplication = { applicantId: '456', teamId: '789', message: 'Test Application', state: NotificationState.NotSeen };
    commsService.success.subscribe(success => expect(success).toBe(`${application.userName} application has been rejected!`));
    service.rejectApplication(application).subscribe();
    const req = httpMock.expectOne(`${service['_apiEndpoint']}/teams/rejectapplication`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(application);
    expect(req.request.withCredentials).toBe(true);
    req.flush({});

    const errorMessage = `Http failure response for ${service['_apiEndpoint']}/teams/rejectapplication: 500 Could not reject application!`;
    commsService.error.subscribe(error => expect(error).toBe(errorMessage));
    service.rejectApplication(application).subscribe({
      error: err => expect(err.message).toBe(errorMessage)
    });
    const req2 = httpMock.expectOne(`${service['_apiEndpoint']}/teams/rejectapplication`);
    expect(req2.request.method).toBe('PUT');
    expect(req2.request.body).toEqual(application);
    expect(req2.request.withCredentials).toBe(true);
    req2.error(new ProgressEvent('Server Error'), { status: 500, statusText: 'Could not reject application!' });
  });

  it('setTeamMapPool should send a PUT request to the correct URL', () => {
    const mapstatus: CSGOMapPool[] = [
      { mapId: CSGOMap.Dust2, isPlayed: true },
      { mapId: CSGOMap.Inferno, isPlayed: true },
      { mapId: CSGOMap.Mirage, isPlayed: false },
      { mapId: CSGOMap.Nuke, isPlayed: false }
    ];
    commsService.success.subscribe(success => expect(success).toBe('Map selection saved!'));
    service.setTeamMapPool(mapstatus).subscribe();
    const req = httpMock.expectOne(`${service['_apiEndpoint']}/teams/mapPool`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mapstatus);
    expect(req.request.withCredentials).toBe(true);
    req.flush({});

    const errorMessage = `Http failure response for ${service['_apiEndpoint']}/teams/mapPool: 500 Could not save map selection!`;
    commsService.error.subscribe(error => expect(error).toBe(errorMessage));
    service.setTeamMapPool(mapstatus).subscribe({
      error: err => expect(err.message).toBe(errorMessage)
    });
    const req2 = httpMock.expectOne(`${service['_apiEndpoint']}/teams/mapPool`);
    expect(req2.request.method).toBe('PUT');
    expect(req2.request.body).toEqual(mapstatus);
    expect(req2.request.withCredentials).toBe(true);
    req2.error(new ProgressEvent('Server Error'), { status: 500, statusText: 'Could not save map selection!' });
  });

  it('getTeamTournaments should send a GET request to the correct URL', () => {
    const teamid = '234';
    service.getTeamTournaments(teamid).subscribe();
    const req = httpMock.expectOne(`${service['_apiEndpoint']}/teams/tournaments?teamid=${teamid}`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('getTeamPractice should send a GET request to the correct URL', () => {
    const teamid = '567';
    service.getTeamPractice(teamid).subscribe();
    const req = httpMock.expectOne(`${service['_apiEndpoint']}/teams/availability?teamid=${teamid}`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('setTeamPractice should send a PUT request to the correct URL', () => {
    const day: Availability = {
      teamId: '456',
      day: DayOfWeek.Monday,
      available: true,
      from: new Date(),
      to: new Date()
    };
    commsService.success.subscribe(success => expect(success).toBe('Practice schedule updated!'));
    service.setTeamPractice(day).subscribe();
    const req = httpMock.expectOne(`${service['_apiEndpoint']}/teams/availability`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(day);
    expect(req.request.withCredentials).toBe(true);
    req.flush({});

    const errorMessage = `Http failure response for ${service['_apiEndpoint']}/teams/availability: 500 Could not update practice schedule!`;
    commsService.error.subscribe(error => expect(error).toBe(errorMessage));
    service.setTeamPractice(day).subscribe({
      error: err => expect(err.message).toBe(errorMessage)
    });
    const req2 = httpMock.expectOne(`${service['_apiEndpoint']}/teams/availability`);
    expect(req2.request.method).toBe('PUT');
    expect(req2.request.body).toEqual(day);
    expect(req2.request.withCredentials).toBe(true);
    req2.error(new ProgressEvent('Server Error'), { status: 500, statusText: 'Could not update practice schedule!' });
  });

  it('getPlayer should send a GET request to the correct URL', () => {
    let userId = '1';
    const player: CSGOPlayer = {
      id: '1',
      steamId: 'test-steam-id',
      battleNetId: 'test-battlenet-id',
      username: 'test-username',
      email: 'test-email',
      avatarFull: 'test-avatar',
      avatarMedium: 'test-avatar',
      avatarIcon: 'test-avatar',
      customURL: 'test-url',
      realname: 'test-realname',
      searchVisible: true,
      externalLogins: [],
      steamUser: null,
      steamUserException: false,
      userStats: null,
      userStatsException: true,
      registered: false,
      headshotPercentage: 0,
      killDeathRatio: 0,
      accuracy: 0,
      steamPrivate: true
    };
    const sub1 = commsService.error.subscribe(error => expect(error).toBe('Account is private!'));
    service.getPlayer(userId).subscribe();
    expect(service.loadingPlayer.value).toBe(true);
    const req = httpMock.expectOne(`${service['_apiEndpoint']}/users?userid=${userId}`);
    expect(req.request.method).toBe('GET');
    req.flush(player);
    expect(service.loadingPlayer.value).toBe(false);
    expect(service['_currentPlayer'].value).toEqual(player);

    sub1.unsubscribe();
    commsService.error.subscribe(error => expect(error).toBe(`Http failure response for ${service['_apiEndpoint']}/users?userid=2: 404 Player not found!`));
    userId = '2';
    service.getPlayer(userId).subscribe({
      error: () => {
        expect(service.loadingPlayer.value).toBe(false);
        expect(service['_currentPlayer'].value).toBeNull();
      }
    });
    expect(service.loadingPlayer.value).toBe(true);
    const req2 = httpMock.expectOne(`${service['_apiEndpoint']}/users?userid=${userId}`);
    expect(req2.request.method).toBe('GET');
    req2.error(new ProgressEvent('Not Found'), { status: 404, statusText: 'Player not found!' });
  });

  it('getPlayerGroups should send a GET request to the correct URL', () => {
    const userId = '456';
    service.getPlayerGroups(userId).subscribe();
    const req = httpMock.expectOne(`${service['_apiEndpoint']}/users/usergroups?userid=${userId}`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('player getAvailability should send a GET request to the correct URL', () => {
    const userId = '012';
    service.getAvailability(userId).subscribe();
    const req = httpMock.expectOne(`${service['_apiEndpoint']}/users/availability?userid=${userId}`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('player setAvailability should send a PUT request to the correct URL', () => {
    const availability: Availability = {
      userId: '123',
      day: DayOfWeek.Monday,
      available: true,
      from: new Date(),
      to: new Date()
    };
    commsService.success.subscribe(success => expect(success).toBe('Availability updated!'));
    service.setAvailability(availability).subscribe();
    const req = httpMock.expectOne(`${service['_apiEndpoint']}/users/availability`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(availability);
    expect(req.request.withCredentials).toBe(true);
    req.flush({});

    const errorMessage = `Http failure response for ${service['_apiEndpoint']}/users/availability: 500 Could not update availability!`;
    commsService.error.subscribe(error => expect(error).toBe(errorMessage));
    service.setAvailability(availability).subscribe({
      error: err => expect(err.message).toBe(errorMessage)
    });
    const req2 = httpMock.expectOne(`${service['_apiEndpoint']}/users/availability`);
    expect(req2.request.method).toBe('PUT');
    expect(req2.request.body).toEqual(availability);
    expect(req2.request.withCredentials).toBe(true);
    req2.error(new ProgressEvent('Server Error'), { status: 500, statusText: 'Could not update availability!' });
  });

  it('setPrimaryRole should send a PUT request to the correct URL', () => {
    const role: Role = { id: PlaystyleRole.Awper, name: 'Awper' };
    commsService.success.subscribe(success => expect(success).toBe(`Primary role set to ${role.name}`));
    service.setPrimaryRole(role).subscribe();
    const req = httpMock.expectOne(`${service['_apiEndpoint']}/users/primaryrole?id=${role.id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(role);
    expect(req.request.withCredentials).toBe(true);
    req.flush({});

    const errorMessage = `Http failure response for ${service['_apiEndpoint']}/users/primaryrole?id=${role.id}: 500 Could not update primary role!`;
    commsService.error.subscribe(error => expect(error).toBe(errorMessage));
    service.setPrimaryRole(role).subscribe({
      error: err => expect(err.message).toBe(errorMessage)
    });
    const req2 = httpMock.expectOne(`${service['_apiEndpoint']}/users/primaryrole?id=${role.id}`);
    expect(req2.request.method).toBe('PUT');
    expect(req2.request.body).toEqual(role);
    expect(req2.request.withCredentials).toBe(true);
    req2.error(new ProgressEvent('Server Error'), { status: 500, statusText: 'Could not update primary role!' });
  });

  it('setSecondaryRole should send a PUT request to the correct URL', () => {
    const role: Role = { id: PlaystyleRole.IGL, name: 'Ingame Leader' };
    commsService.success.subscribe(success => expect(success).toBe(`Secondary role set to ${role.name}`));
    service.setSecondaryRole(role).subscribe();
    const req = httpMock.expectOne(`${service['_apiEndpoint']}/users/secondaryrole?id=${role.id}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(role);
    expect(req.request.withCredentials).toBe(true);
    req.flush({});

    const errorMessage = `Http failure response for ${service['_apiEndpoint']}/users/secondaryrole?id=${role.id}: 500 Could not update secondary role!`;
    commsService.error.subscribe(error => expect(error).toBe(errorMessage));
    service.setSecondaryRole(role).subscribe({
      error: err => expect(err.message).toBe(errorMessage)
    });
    const req2 = httpMock.expectOne(`${service['_apiEndpoint']}/users/secondaryrole?id=${role.id}`);
    expect(req2.request.method).toBe('PUT');
    expect(req2.request.body).toEqual(role);
    expect(req2.request.withCredentials).toBe(true);
    req2.error(new ProgressEvent('Server Error'), { status: 500, statusText: 'Could not update secondary role!' });
  });

  it('getMapPool should send a GET request to the correct URL', () => {
    const userId = '234';
    service.getMapPool(userId).subscribe();
    const req = httpMock.expectOne(`${service['_apiEndpoint']}/users/mapPool?userid=${userId}`);
    expect(req.request.method).toBe('GET');
    req.flush({});
  });

  it('setMapPool should send a PUT request to the correct URL', () => {
    const mapstatus: CSGOMapPool = { mapId: CSGOMap.Dust2, isPlayed: true };
    commsService.success.subscribe(success => expect(success).toBe('Map pool updated!'));
    service.setMapPool(mapstatus).subscribe();
    const req = httpMock.expectOne(`${service['_apiEndpoint']}/users/mapPool`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mapstatus);
    expect(req.request.withCredentials).toBe(true);
    req.flush({});

    const errorMessage = `Http failure response for ${service['_apiEndpoint']}/users/mapPool: 500 Could not update map pool!`;
    commsService.error.subscribe(error => expect(error).toBe(errorMessage));
    service.setMapPool(mapstatus).subscribe({
      error: err => expect(err.message).toBe(errorMessage)
    });
    const req2 = httpMock.expectOne(`${service['_apiEndpoint']}/users/mapPool`);
    expect(req2.request.method).toBe('PUT');
    expect(req2.request.body).toEqual(mapstatus);
    expect(req2.request.withCredentials).toBe(true);
    req2.error(new ProgressEvent('Server Error'), { status: 500, statusText: 'Could not update map pool!' });
  });

  it('acceptInvite should send a PUT request to the correct URL', () => {
    const notification: UserNotification = { state: NotificationState.NotSeen, teamInfo: null, invitingUser: null, sent: '' };
    commsService.success.subscribe(success => expect(success).toBe('Team invite accepted!'));
    service.acceptInvite(notification).subscribe();
    const req = httpMock.expectOne(`${service['_apiEndpoint']}/users/acceptTeamInvite`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(notification);
    expect(req.request.withCredentials).toBe(true);
    req.flush({});

    const errorMessage = `Http failure response for ${service['_apiEndpoint']}/users/acceptTeamInvite: 500 Could not accept team invite!`;
    commsService.error.subscribe(error => expect(error).toBe(errorMessage));
    service.acceptInvite(notification).subscribe({
      error: err => expect(err.message).toBe(errorMessage)
    });
    const req2 = httpMock.expectOne(`${service['_apiEndpoint']}/users/acceptTeamInvite`);
    expect(req2.request.method).toBe('PUT');
    expect(req2.request.body).toEqual(notification);
    expect(req2.request.withCredentials).toBe(true);
    req2.error(new ProgressEvent('Server Error'), { status: 500, statusText: 'Could not accept team invite!' });
  });

  it('rejectInvite should send a PUT request to the correct URL', () => {
    const notification: UserNotification = { state: NotificationState.NotSeen, teamInfo: null, invitingUser: null, sent: '' };
    commsService.success.subscribe(success => expect(success).toBe('Team invite rejected!'));
    service.rejectInvite(notification).subscribe();
    const req = httpMock.expectOne(`${service['_apiEndpoint']}/users/rejectTeamInvite`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(notification);
    expect(req.request.withCredentials).toBe(true);
    req.flush({});

    const errorMessage = `Http failure response for ${service['_apiEndpoint']}/users/rejectTeamInvite: 500 Could not reject team invite!`;
    commsService.error.subscribe(error => expect(error).toBe(errorMessage));
    service.rejectInvite(notification).subscribe({
      error: err => expect(err.message).toBe(errorMessage)
    });
    const req2 = httpMock.expectOne(`${service['_apiEndpoint']}/users/rejectTeamInvite`);
    expect(req2.request.method).toBe('PUT');
    expect(req2.request.body).toEqual(notification);
    expect(req2.request.withCredentials).toBe(true);
    req2.error(new ProgressEvent('Server Error'), { status: 500, statusText: 'Could not reject team invite!' });
  });
});
