import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BellumgensApiService } from './bellumgens-api.service';
import { SteamGroup, SteamUser } from '../models/steamuser';
import { CSGOTeam, TeamMember, TeamApplication } from '../models/csgoteam';
import { Availability, DayOfWeek } from '../models/playeravailability';
import { PlaystyleRole, Role } from '../models/playerrole';
import { CSGOMap, CSGOMapPool } from '../models/csgomaps';
import { NotificationState, UserNotification } from '../models/usernotifications';


describe('BellumgensApiService', () => {
  let service: BellumgensApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ BellumgensApiService ]
    });
    service = TestBed.inject(BellumgensApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUserTeams', () => {
    it('should send a GET request to the correct URL', () => {
      const userId = '123';
      service.getUserTeams(userId).subscribe();
      const req = httpMock.expectOne(`${service['_apiEndpoint']}/users/userteams?userid=${userId}`);
      expect(req.request.method).toBe('GET');
      expect(req.request.withCredentials).toBe(true);
    });
  });

  describe('teamApplications', () => {
    it('should send a GET request to the correct URL', () => {
      const teamId = '456';
      service.teamApplications(teamId).subscribe();
      const req = httpMock.expectOne(`${service['_apiEndpoint']}/teams/applications?teamId=${teamId}`);
      expect(req.request.method).toBe('GET');
      expect(req.request.withCredentials).toBe(true);
    });
  });

  describe('getTeam', () => {
    it('should send a GET request to the correct URL', () => {
      const teamId = '789';
      service.getTeam(teamId).subscribe();
      const req = httpMock.expectOne(`${service['_apiEndpoint']}/teams?teamid=${teamId}`);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('getTeamMembers', () => {
    it('should send a GET request to the correct URL', () => {
      const teamId = '012';
      service.getTeamMembers(teamId).subscribe();
      const req = httpMock.expectOne(`${service['_apiEndpoint']}/teams/members?teamid=${teamId}`);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('getTeamSchedule', () => {
    it('should send a GET request to the correct URL', () => {
      const teamId = '345';
      service.getTeamSchedule(teamId).subscribe();
      const req = httpMock.expectOne(`${service['_apiEndpoint']}/teams/availability?teamid=${teamId}`);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('registerSteamGroup', () => {
    it('should send a POST request to the correct URL', () => {
      const group: SteamGroup = {
        groupID64: '678',
        groupName: 'Test Group',
        isPrimary: true,
        avatarFull: 'test.jpg',
        avatarMedium: 'test.jpg',
        avatarIcon: 'test.jpg',
        members: []
      };
      service.registerSteamGroup(group).subscribe();
      const req = httpMock.expectOne(`${service['_apiEndpoint']}/teams/team`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(group);
      expect(req.request.withCredentials).toBe(true);
    });
  });

  describe('registerTeam', () => {
    it('should send a POST request to the correct URL', () => {
      const team: CSGOTeam = { teamId: '901', teamName: 'Test Team', visible: true, teamAvatar: 'test.jpg' };
      service.registerTeam(team).subscribe();
      const req = httpMock.expectOne(`${service['_apiEndpoint']}/teams/newteam`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(team);
      expect(req.request.withCredentials).toBe(true);
    });
  });

  describe('updateTeam', () => {
    it('should send a PUT request to the correct URL', () => {
      const team: CSGOTeam = { teamId: '234', teamName: 'Test Team', visible: true, teamAvatar: 'test.jpg' };
      service.updateTeam(team).subscribe();
      const req = httpMock.expectOne(`${service['_apiEndpoint']}/teams/team`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(team);
      expect(req.request.withCredentials).toBe(true);
    });
  });

  describe('updateTeamMember', () => {
    it('should send a PUT request to the correct URL', () => {
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
      service.updateTeamMember(teamMember).subscribe();
      const req = httpMock.expectOne(`${service['_apiEndpoint']}/teams/member`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(teamMember);
      expect(req.request.withCredentials).toBe(true);
    });
  });

  describe('removeTeamMember', () => {
    it('should send a DELETE request to the correct URL', () => {
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
      service.removeTeamMember(teamMember).subscribe();
      const req = httpMock.expectOne(`${service['_apiEndpoint']}/teams/removemember?teamId=${teamMember.teamId}&userId=${teamMember.userId}`);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.withCredentials).toBe(true);
    });
  });

  describe('abandonTeam', () => {
    it('should send a DELETE request to the correct URL', () => {
      const team: CSGOTeam = { teamId: '123', teamName: 'Test Team', visible: true, teamAvatar: 'test.jpg' };
      service.abandonTeam(team).subscribe();
      const req = httpMock.expectOne(`${service['_apiEndpoint']}/teams/abandon?teamId=${team.teamId}`);
      expect(req.request.method).toBe('DELETE');
      expect(req.request.withCredentials).toBe(true);
    });
  });

  describe('inviteToTeam', () => {
    it('should send a POST request to the correct URL', () => {
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
      service.inviteToTeam(steamUser, team).subscribe();
      const req = httpMock.expectOne(`${service['_apiEndpoint']}/teams/invite`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({userId: steamUser.steamID64, teamId: team.teamId});
      expect(req.request.withCredentials).toBe(true);
    });
  });

  describe('submitApplication', () => {
    it('should send a POST request to the correct URL', () => {
      const application: TeamApplication = { applicantId: '012', teamId: '123', message: 'Test Application', state: NotificationState.NotSeen };
      service.submitApplication(application).subscribe();
      const req = httpMock.expectOne(`${service['_apiEndpoint']}/teams/apply`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(application);
      expect(req.request.withCredentials).toBe(true);
    });
  });

  describe('getTeamApplications', () => {
    it('should send a GET request to the correct URL', () => {
      const teamId = '345';
      service.getTeamApplications(teamId).subscribe();
      const req = httpMock.expectOne(`${service['_apiEndpoint']}/teams/applications?teamId=${teamId}`);
      expect(req.request.method).toBe('GET');
      expect(req.request.withCredentials).toBe(true);
    });
  });

  describe('approveApplication', () => {
    it('should send a PUT request to the correct URL', () => {
      const application: TeamApplication = { applicantId: '678', teamId: '456', message: 'Test Application', state: NotificationState.NotSeen };
      service.approveApplication(application).subscribe();
      const req = httpMock.expectOne(`${service['_apiEndpoint']}/teams/approveapplication`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(application);
      expect(req.request.withCredentials).toBe(true);
    });
  });

  describe('rejectApplication', () => {
    it('should send a PUT request to the correct URL', () => {
      const application: TeamApplication = { applicantId: '456', teamId: '789', message: 'Test Application', state: NotificationState.NotSeen };
      service.rejectApplication(application).subscribe();
      const req = httpMock.expectOne(`${service['_apiEndpoint']}/teams/rejectapplication`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(application);
      expect(req.request.withCredentials).toBe(true);
    });
  });

  describe('setTeamMapPool', () => {
    it('should send a PUT request to the correct URL', () => {
      const mapstatus: CSGOMapPool[] = [
        { mapId: CSGOMap.Dust2, isPlayed: true },
        { mapId: CSGOMap.Inferno, isPlayed: true },
        { mapId: CSGOMap.Mirage, isPlayed: false },
        { mapId: CSGOMap.Nuke, isPlayed: false }
      ];
      service.setTeamMapPool(mapstatus).subscribe();
      const req = httpMock.expectOne(`${service['_apiEndpoint']}/teams/mapPool`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mapstatus);
      expect(req.request.withCredentials).toBe(true);
    });
  });

  describe('getTeamTournaments', () => {
    it('should send a GET request to the correct URL', () => {
      const teamid = '234';
      service.getTeamTournaments(teamid).subscribe();
      const req = httpMock.expectOne(`${service['_apiEndpoint']}/teams/tournaments?teamid=${teamid}`);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('getTeamPractice', () => {
    it('should send a GET request to the correct URL', () => {
      const teamid = '567';
      service.getTeamPractice(teamid).subscribe();
      const req = httpMock.expectOne(`${service['_apiEndpoint']}/teams/availability?teamid=${teamid}`);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('setTeamPractice', () => {
    it('should send a PUT request to the correct URL', () => {
      const day: Availability = {
        teamId: '456',
        day: DayOfWeek.Monday,
        available: true,
        from: new Date(),
        to: new Date()
      };
      service.setTeamPractice(day).subscribe();
      const req = httpMock.expectOne(`${service['_apiEndpoint']}/teams/availability`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(day);
      expect(req.request.withCredentials).toBe(true);
    });
  });

  describe('getPlayer', () => {
    it('should send a GET request to the correct URL', () => {
      const userId = '123';
      service.getPlayer(userId).subscribe();
      const req = httpMock.expectOne(`${service['_apiEndpoint']}/users?userid=${userId}`);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('getPlayerGroups', () => {
    it('should send a GET request to the correct URL', () => {
      const userId = '456';
      service.getPlayerGroups(userId).subscribe();
      const req = httpMock.expectOne(`${service['_apiEndpoint']}/users/usergroups?userid=${userId}`);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('getPlayerFromServer', () => {
    it('should send a GET request to the correct URL', () => {
      const userId = '789';
      service.getPlayerFromServer(userId).subscribe();
      const req = httpMock.expectOne(`${service['_apiEndpoint']}/users?userid=${userId}`);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('player getAvailability', () => {
    it('should send a GET request to the correct URL', () => {
      const userId = '012';
      service.getAvailability(userId).subscribe();
      const req = httpMock.expectOne(`${service['_apiEndpoint']}/users/availability?userid=${userId}`);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('player setAvailability', () => {
    it('should send a PUT request to the correct URL', () => {
      const availability: Availability = {
        userId: '123',
        day: DayOfWeek.Monday,
        available: true,
        from: new Date(),
        to: new Date()
      };
      service.setAvailability(availability).subscribe();
      const req = httpMock.expectOne(`${service['_apiEndpoint']}/users/availability`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(availability);
      expect(req.request.withCredentials).toBe(true);
    });
  });

  describe('setPrimaryRole', () => {
    it('should send a PUT request to the correct URL', () => {
      const role: Role = { id: PlaystyleRole.Awper, name: 'Awper' };
      service.setPrimaryRole(role).subscribe();
      const req = httpMock.expectOne(`${service['_apiEndpoint']}/users/primaryrole?id=${role.id}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(role);
      expect(req.request.withCredentials).toBe(true);
    });
  });

  describe('setSecondaryRole', () => {
    it('should send a PUT request to the correct URL', () => {
      const role: Role = { id: PlaystyleRole.IGL, name: 'Ingame Leader' };
      service.setSecondaryRole(role).subscribe();
      const req = httpMock.expectOne(`${service['_apiEndpoint']}/users/secondaryrole?id=${role.id}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(role);
      expect(req.request.withCredentials).toBe(true);
    });
  });

  describe('getMapPool', () => {
    it('should send a GET request to the correct URL', () => {
      const userId = '234';
      service.getMapPool(userId).subscribe();
      const req = httpMock.expectOne(`${service['_apiEndpoint']}/users/mapPool?userid=${userId}`);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('setMapPool', () => {
    it('should send a PUT request to the correct URL', () => {
      const mapstatus: CSGOMapPool = { mapId: CSGOMap.Dust2, isPlayed: true };
      service.setMapPool(mapstatus).subscribe();
      const req = httpMock.expectOne(`${service['_apiEndpoint']}/users/mapPool`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mapstatus);
      expect(req.request.withCredentials).toBe(true);
    });
  });

  describe('acceptInvite', () => {
    it('should send a PUT request to the correct URL', () => {
      const notification: UserNotification = { state: NotificationState.NotSeen, teamInfo: null, invitingUser: null, sent: '' };
      service.acceptInvite(notification).subscribe();
      const req = httpMock.expectOne(`${service['_apiEndpoint']}/users/acceptTeamInvite`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(notification);
      expect(req.request.withCredentials).toBe(true);
    });
  });

  describe('rejectInvite', () => {
    it('should send a PUT request to the correct URL', () => {
      const notification: UserNotification = { state: NotificationState.NotSeen, teamInfo: null, invitingUser: null, sent: '' };
      service.rejectInvite(notification).subscribe();
      const req = httpMock.expectOne(`${service['_apiEndpoint']}/users/rejectTeamInvite`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(notification);
      expect(req.request.withCredentials).toBe(true);
    });
  });
});
