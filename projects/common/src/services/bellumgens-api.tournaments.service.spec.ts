import { TestBed } from '@angular/core/testing';

import { ApiTournamentsService } from './bellumgens-api.tournaments.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TournamentCSGOMatch, TournamentSC2Match } from '../models/tournament-schedule';
import { CommunicationService, Game, TournamentApplication, TournamentCSGOGroup, TournamentParticipant, TournamentSC2Group } from '../public_api';

describe('ApiTournamentsService', () => {
  let service: ApiTournamentsService;
  let httpMock: HttpTestingController;
  let commsService: CommunicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ ApiTournamentsService ]
    });
    service = TestBed.inject(ApiTournamentsService);
    httpMock = TestBed.inject(HttpTestingController);
    commsService = TestBed.inject(CommunicationService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all tournaments', () => {
    const mockTournaments = [
      { id: '1', name: 'Tournament 1' },
      { id: '2', name: 'Tournament 2' }
    ];

    service.tournaments.subscribe();

    const req = httpMock.expectOne(`${service['_apiEndpoint']}/tournament/tournaments`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTournaments);
    expect(service['_tournaments'].value).toEqual(mockTournaments);
  });

  it('should get a tournament by id', () => {
    const mockTournament = { id: '123', name: 'Tournament 1' };

    service.getTournament('123').subscribe();

    const req = httpMock.expectOne(`${service['_apiEndpoint']}/tournament?id=${mockTournament.id}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTournament);
    expect(service['_tournament'].value).toEqual(mockTournament);
  });

  it('should create a tournament', () => {
    const mockTournament = { name: 'New Tournament' };

    commsService.success.subscribe(success => expect(success).toBe('Tournament updated successfully!'));
    service.createTournament(mockTournament).subscribe(tournament => {
      expect(tournament).toEqual({ id: '1', ...mockTournament });
    });

    const req = httpMock.expectOne(`${service['_apiEndpoint']}/tournament/create`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockTournament);
    expect(req.request.withCredentials).toBe(true);
    req.flush({ id: '1', ...mockTournament });

    const errorMessage = `Http failure response for ${service['_apiEndpoint']}/tournament/create: 500 Tournament creation failed`;
    commsService.error.subscribe(error => expect(error).toBe(errorMessage));
    const req4 = httpMock.expectOne(`${service['_apiEndpoint']}/tournament/create`);
    expect(req4.request.method).toBe('PUT');
    expect(req4.request.body).toEqual(mockTournament);
    expect(req4.request.withCredentials).toBe(true);
    req4.error(new ProgressEvent('Server Error'), { status: 500, statusText: 'Tournament creation failed' });
  });

  it('should delete a registration', () => {
    const mockRegistrationId = '1';

    service.deleteRegistration(mockRegistrationId).subscribe(() => {
      expect(service.allRegistrations.value).not.toContain(jasmine.objectContaining({ id: mockRegistrationId }));
    });

    let req = httpMock.expectOne(`${service['_apiEndpoint']}/tournament/delete?id=${mockRegistrationId}`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.withCredentials).toBe(true);
    req.flush({});
    req = httpMock.expectOne(`${service['_apiEndpoint']}/tournament/allregistrations`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBe(true);
    req.flush([]);
  });

  it('should submit a CS:GO match', () => {
    const mockMatch: TournamentCSGOMatch = { tournamentId: '1', team1Id: 'Team A', team2Id: 'Team B' };

    service.submitCSGOMatch(mockMatch).subscribe(match => {
      expect(match).toEqual({ id: '1', ...mockMatch });
    });

    const req = httpMock.expectOne(`${service['_apiEndpoint']}/tournament/csgomatch`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockMatch);
    expect(req.request.withCredentials).toBe(true);
    req.flush({ id: '1', ...mockMatch });
  });

  it('should delete a CS:GO match', () => {
    const mockMatchId = '1';

    service.deleteCSGOMatch({ id: mockMatchId } as TournamentCSGOMatch).subscribe(() => {
      expect(service['_csgoMatches'].get(mockMatchId)).toBeUndefined();
    });

    const req = httpMock.expectOne(`${service['_apiEndpoint']}/tournament/csgomatch?id=${mockMatchId}`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.withCredentials).toBe(true);
    req.flush({});
  });

  it('should get all registrations', () => {
    const mockRegistrations: TournamentApplication [] = [
      { id: '1', email: 'test@mail.com', game: Game.CSGO },
      { id: '2', email: 'test1@mail.co.uk', game: Game.StarCraft2 }
    ];

    service.allRegistrations.subscribe();

    const req = httpMock.expectOne(`${service['_apiEndpoint']}/tournament/allregistrations`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBe(true);
    req.flush(mockRegistrations);
    expect(service['_allRegistrations'].value).toEqual(mockRegistrations);
  });

  it('should get registrations count', () => {
    const mockRegistrationsCount = [
      { game: Game.CSGO, count: 10 },
      { game: Game.StarCraft2, count: 20 }
    ];

    service.getRegistrationsCount('1');

    const req = httpMock.expectOne(`${service['_apiEndpoint']}/tournament/regcount?tournamentId=1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockRegistrationsCount);
    expect(service.registrationsCount.value).toEqual(mockRegistrationsCount);
  });

  it('should get CS:GO registrations', () => {
    const mockCsgoRegistrations: TournamentParticipant[] = [
      {
        id: '1',
        userId: '123',
        teamId: '123',
        state: 0,
        companyId: '123',
        playerPoints: 0,
        teamPoints: 0,
        wins: 0,
        losses: 0,
        oTWins: 0,
        oTLosses: 0,
        roundDifference: 0,
        battleTag: 'test',
        tournamentCSGOGroupId: '123',
        tournamentSC2GroupId: '123',
        user: null,
        team: null
      }
    ];

    service.getCsgoRegistrations('1').subscribe();

    const req = httpMock.expectOne(`${service['_apiEndpoint']}/tournament/csgoregs?tournamentId=1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCsgoRegistrations);
    expect(service['_csgoRegistrations'].get('1').value).toEqual(mockCsgoRegistrations);
  });

  it('should get StarCraft II registrations', () => {
    const mockSc2Registrations: TournamentParticipant [] = [
      {
        id: '1',
        userId: '123',
        teamId: '123',
        state: 0,
        companyId: '123',
        playerPoints: 0,
        teamPoints: 0,
        wins: 0,
        losses: 0,
        oTWins: 0,
        oTLosses: 0,
        roundDifference: 0,
        battleTag: 'test',
        tournamentCSGOGroupId: '123',
        tournamentSC2GroupId: '123',
        user: null,
        team: null
      }
    ];

    service.getSc2Registrations('1').subscribe();

    const req = httpMock.expectOne(`${service['_apiEndpoint']}/tournament/sc2regs?tournamentId=1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockSc2Registrations);
    expect(service['_sc2Registrations'].get('1').value).toEqual(mockSc2Registrations);
  });

  it('should get CS:GO matches', () => {
    const mockCsgoMatches: TournamentCSGOMatch [] = [
      { id: '1', team1Id: 'Team A', team2Id: 'Team B' },
      { id: '2', team1Id: 'Team C', team2Id: 'Team D' }
    ];

    service.getCsgoMatches('1').subscribe();

    const req = httpMock.expectOne(`${service['_apiEndpoint']}/tournament/csgomatches?tournamentId=1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCsgoMatches);
    expect(service['_csgoMatches'].get('1').value).toEqual(mockCsgoMatches);
  });

  it('should get StarCraft II matches', () => {
    const mockSc2Matches: TournamentSC2Match [] = [
      { id: '1', player1Id: 'Player A', player2Id: 'Player B' },
      { id: '2', player1Id: 'Player C', player2Id: 'Player D' }
    ];

    service.getSc2Matches('1').subscribe();

    const req = httpMock.expectOne(`${service['_apiEndpoint']}/tournament/sc2matches?tournamentId=1`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBe(true);
    req.flush(mockSc2Matches);
    expect(service['_sc2Matches'].get('1').value).toEqual(mockSc2Matches);
  });

  it('should get CS:GO groups', () => {
    const mockCsgoGroups = [
      { id: '1', name: 'Group A' },
      { id: '2', name: 'Group B' }
    ];

    service.getCsgoGroups('1').subscribe();

    const req = httpMock.expectOne(`${service['_apiEndpoint']}/tournament/csgogroups?tournamentId=1`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBe(true);
    req.flush(mockCsgoGroups);
    expect(service['_csgoGroups'].get('1').value).toEqual(mockCsgoGroups);
  });

  it('should get StarCraft II groups', () => {
    const mockSc2Groups = [
      { id: '1', name: 'Group A' },
      { id: '2', name: 'Group B' }
    ];

    service.getSc2Groups('1').subscribe();

    const req = httpMock.expectOne(`${service['_apiEndpoint']}/tournament/sc2groups?tournamentId=1`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBe(true);
    req.flush(mockSc2Groups);
    expect(service['_sc2Groups'].get('1').value).toEqual(mockSc2Groups);
  });

  it('should submit a CS:GO group', () => {
    const mockGroup: TournamentCSGOGroup = { tournamentId: '1', name: 'Group A' };

    service.submitCSGOGroup(mockGroup).subscribe(group => {
      expect(group).toEqual({ id: '1', ...mockGroup });
    });

    const req = httpMock.expectOne(`${service['_apiEndpoint']}/tournament/csgogroup`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockGroup);
    expect(req.request.withCredentials).toBe(true);
    req.flush({ id: '1', ...mockGroup });
  });

  it('should delete a CS:GO group', () => {
    const mockGroupId = '1';

    service.deleteGroup(mockGroupId).subscribe(() => {
      expect(service['_csgoGroups'].get(mockGroupId)).toBeUndefined();
    });

    const req = httpMock.expectOne(`${service['_apiEndpoint']}/tournament/group?id=${mockGroupId}`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.withCredentials).toBe(true);
    req.flush({});
  });

  it('should add a participant to a CS:GO group', () => {
    const mockParticipant: TournamentParticipant = {
      id: '1',
      userId: '123',
      teamId: '123',
      state: 0,
      companyId: '123',
      playerPoints: 0,
      teamPoints: 0,
      wins: 0,
      losses: 0,
      oTWins: 0,
      oTLosses: 0,
      roundDifference: 0,
      battleTag: 'test',
      tournamentCSGOGroupId: '123',
      tournamentSC2GroupId: '123',
      user: null,
      team: null
    };
    const mockGroupId = '1';

    service.addParticipantToGroup(mockParticipant, mockGroupId).subscribe(group => {
      expect(group).toEqual({ id: '1', participants: [mockParticipant] });
    });

    const req = httpMock.expectOne(`${service['_apiEndpoint']}/tournament/participanttogroup?id=${mockGroupId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockParticipant);
    expect(req.request.withCredentials).toBe(true);
    req.flush({ id: '1', participants: [mockParticipant] });
  });

  it('should remove a participant from a CS:GO group', () => {
    const mockParticipantId = '1';

    service.removeParticipantFromGroup(mockParticipantId).subscribe();

    const req = httpMock.expectOne(`${service['_apiEndpoint']}/tournament/participanttogroup?id=${mockParticipantId}`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.withCredentials).toBe(true);
    req.flush({});
  });

  it('should submit a StarCraft II group', () => {
    const mockGroup: TournamentSC2Group = { tournamentId: '1', name: 'Group A' };

    service.submitSC2Group(mockGroup).subscribe(group => {
      expect(group).toEqual({ id: '1', ...mockGroup });
    });

    const req = httpMock.expectOne(`${service['_apiEndpoint']}/tournament/sc2group`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockGroup);
    expect(req.request.withCredentials).toBe(true);
    req.flush({ id: '1', ...mockGroup });
  });

  // it('should submit a CS:GO match map', () => {
  //   const mockMatchMap: TournamentCSGOMatchMap = { id: '1', map: 'Map A' };

  //   service.submitCSGOMatchMap(mockMatchMap).subscribe(matchMap => {
  //     expect(matchMap).toEqual(mockMatchMap);
  //   });

  //   const req = httpMock.expectOne(`${service['_apiEndpoint']}/tournament/csgomatchmap?id=${mockMatchMap.id}`);
  //   expect(req.request.method).toBe('PUT');
  //   expect(req.request.body).toEqual(mockMatchMap);
  //   expect(req.request.withCredentials).toBe(true);
  //   req.flush(mockMatchMap);
  // });

  it('should delete a CS:GO match map', () => {
    const mockMatchMapId = '1';

    service.deleteCSGOMatchMap(mockMatchMapId).subscribe();

    const req = httpMock.expectOne(`${service['_apiEndpoint']}/tournament/csgomatchmap?id=${mockMatchMapId}`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.withCredentials).toBe(true);
    req.flush({});
  });

  it('should submit a StarCraft II match', () => {
    const mockMatch: TournamentSC2Match = { tournamentId: '1', player1Id: 'Player A', player2Id: 'Player B' };

    service.submitSC2Match(mockMatch).subscribe(match => {
      expect(match).toEqual({ id: '1', ...mockMatch });
    });

    const req = httpMock.expectOne(`${service['_apiEndpoint']}/tournament/sc2match`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockMatch);
    req.flush({ id: '1', ...mockMatch });
  });

  it('should delete a StarCraft II match', () => {
    const mockMatchId = '1';

    service.deleteSC2Match({ id: mockMatchId } as TournamentSC2Match).subscribe(() => {
      expect(service['_sc2Matches'].get(mockMatchId)).toBeUndefined();
    });

    const req = httpMock.expectOne(`${service['_apiEndpoint']}/tournament/sc2match?id=${mockMatchId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  // it('should submit a StarCraft II match map', () => {
  //   const mockMatchMap: TournamentSC2MatchMap = { id: '1', map: 'Map A' };

  //   service.submitSC2MatchMap(mockMatchMap).subscribe(matchMap => {
  //     expect(matchMap).toEqual(mockMatchMap);
  //   });

  //   const req = httpMock.expectOne(`${service['_apiEndpoint']}/tournament/sc2matchmap?id=${mockMatchMap.id}`);
  //   expect(req.request.method).toBe('PUT');
  //   expect(req.request.body).toEqual(mockMatchMap);
  //   expect(req.request.withCredentials).toBe(true);
  //   req.flush(mockMatchMap);
  // });

  it('should delete a StarCraft II match map', () => {
    const mockMatchMapId = '1';

    service.deleteSC2MatchMap(mockMatchMapId).subscribe();

    const req = httpMock.expectOne(`${service['_apiEndpoint']}/tournament/sc2matchmap?id=${mockMatchMapId}`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.withCredentials).toBe(true);
    req.flush({});
  });
});
