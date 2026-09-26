import { TestBed } from '@angular/core/testing';
import { computed, signal } from '@angular/core';

import { ApiTournamentsService } from './bellumgens-api.tournaments.service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TournamentCSGOMatch, TournamentSC2Match } from '../models/tournament-schedule';
import { CommunicationService, TournamentApplication, TournamentCSGOGroup, TournamentParticipant, TournamentSC2Group } from '../public_api';
import { Game } from '../models/tournament';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { Observable, config as rxjsConfig } from 'rxjs';

describe('ApiTournamentsService', () => {
  let service: ApiTournamentsService;
  let httpMock: HttpTestingController;
  let commsService: CommunicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [ApiTournamentsService, provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
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

    service.tournaments();

    const req = httpMock.expectOne(`${service['_apiEndpoint']}/tournament/tournaments`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTournaments);
    expect(service['_tournaments']()).toEqual(mockTournaments);
  });

  it('should get a tournament by id', () => {
    const mockTournament = { id: '123', name: 'Tournament 1' };

    service.getTournament('123');

    const req = httpMock.expectOne(`${service['_apiEndpoint']}/tournament?id=${mockTournament.id}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTournament);
    expect(service['_tournamentsById'].get('123')()).toEqual(mockTournament);
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
    service.createTournament(mockTournament).subscribe(
      {
        error: (error) => {
          expect(error.message).toBe(errorMessage);
        }
      }
    );
    const req4 = httpMock.expectOne(`${service['_apiEndpoint']}/tournament/create`);
    expect(req4.request.method).toBe('PUT');
    expect(req4.request.body).toEqual(mockTournament);
    expect(req4.request.withCredentials).toBe(true);
    req4.error(new ProgressEvent('Server Error'), { status: 500, statusText: 'Tournament creation failed' });
  });

  it('should delete a registration', () => {
    const mockRegistrationId = '1';

    service.deleteRegistration(mockRegistrationId).subscribe();

    let req = httpMock.expectOne(`${service['_apiEndpoint']}/tournament/delete?id=${mockRegistrationId}`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.withCredentials).toBe(true);
    req.flush({});

    // Reading the getter is what kicks off the refresh, since the signal is still empty.
    const registrations = service.allRegistrations;
    req = httpMock.expectOne(`${service['_apiEndpoint']}/tournament/allregistrations`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBe(true);
    req.flush([]);

    // Asserted after the flush: until then the signal still holds its initial null, and
    // `not.toContain` on null throws rather than passing.
    expect(registrations()).not.toContain(expect.objectContaining({ id: mockRegistrationId }));
  });

  it('should submit a Counter-Strike match', () => {
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

  it('should delete a Counter-Strike match', () => {
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

    service.allRegistrations();

    const req = httpMock.expectOne(`${service['_apiEndpoint']}/tournament/allregistrations`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBe(true);
    req.flush(mockRegistrations);
    expect(service['_allRegistrations']()).toEqual(mockRegistrations);
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
    expect(service.registrationsCount()).toEqual(mockRegistrationsCount);
  });

  it('should get Counter-Strike registrations', () => {
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
        user: null,
        team: null
      }
    ];

    service.getCsgoRegistrations('1');

    const req = httpMock.expectOne(`${service['_apiEndpoint']}/tournament/csgoregs?tournamentId=1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCsgoRegistrations);
    expect(service['_csgoRegistrations'].get('1')()).toEqual(mockCsgoRegistrations);
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
        user: null,
        team: null
      }
    ];

    service.getSc2Registrations('1');

    const req = httpMock.expectOne(`${service['_apiEndpoint']}/tournament/sc2regs?tournamentId=1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockSc2Registrations);
    expect(service['_sc2Registrations'].get('1')()).toEqual(mockSc2Registrations);
  });

  it('should get Counter-Strike matches', () => {
    const mockCsgoMatches: TournamentCSGOMatch [] = [
      { id: '1', team1Id: 'Team A', team2Id: 'Team B' },
      { id: '2', team1Id: 'Team C', team2Id: 'Team D' }
    ];

    service.getCsgoMatches('1');

    const req = httpMock.expectOne(`${service['_apiEndpoint']}/tournament/csgomatches?tournamentId=1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCsgoMatches);
    expect(service['_csgoMatches'].get('1')()).toEqual(mockCsgoMatches);
  });

  it('should get StarCraft II matches', () => {
    const mockSc2Matches: TournamentSC2Match [] = [
      { id: '1', player1Id: 'Player A', player2Id: 'Player B' },
      { id: '2', player1Id: 'Player C', player2Id: 'Player D' }
    ];

    service.getSc2Matches('1');

    const req = httpMock.expectOne(`${service['_apiEndpoint']}/tournament/sc2matches?tournamentId=1`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBe(false);
    req.flush(mockSc2Matches);
    expect(service['_sc2Matches'].get('1')()).toEqual(mockSc2Matches);
  });

  it('should get Counter-Strike groups', () => {
    const mockCsgoGroups = [
      { id: '1', name: 'Group A' },
      { id: '2', name: 'Group B' }
    ];

    service.getCsgoGroups('1');

    const req = httpMock.expectOne(`${service['_apiEndpoint']}/tournament/csgogroups?tournamentId=1`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBe(true);
    req.flush(mockCsgoGroups);
    expect(service['_csgoGroups'].get('1')()).toEqual(mockCsgoGroups);
  });

  it('should get StarCraft II groups', () => {
    const mockSc2Groups = [
      { id: '1', name: 'Group A' },
      { id: '2', name: 'Group B' }
    ];

    service.getSc2Groups('1');

    const req = httpMock.expectOne(`${service['_apiEndpoint']}/tournament/sc2groups?tournamentId=1`);
    expect(req.request.method).toBe('GET');
    expect(req.request.withCredentials).toBe(false);
    req.flush(mockSc2Groups);
    // Cached in reverse order, without mutating the server data
    expect(service['_sc2Groups'].get('1')()).toEqual([mockSc2Groups[1], mockSc2Groups[0]]);
    expect(mockSc2Groups[0].id).toBe('1');
  });

  it('should fetch a per-id cache only once and return the same signal', () => {
    const first = service.getSc2Matches('1');
    const second = service.getSc2Matches('1');
    expect(second).toBe(first);

    const req = httpMock.expectOne(`${service['_apiEndpoint']}/tournament/sc2matches?tournamentId=1`);
    req.flush([{ id: 'm1' }]);

    expect(service.getSc2Matches('1')()).toEqual([{ id: 'm1' }]);
    httpMock.expectNone(`${service['_apiEndpoint']}/tournament/sc2matches?tournamentId=1`);
  });

  it('should re-fetch StarCraft II data into the same signal on refresh', () => {
    const registrations = service.getSc2Registrations('1');
    httpMock.expectOne(`${service['_apiEndpoint']}/tournament/sc2regs?tournamentId=1`).flush([{ id: 'r1' }]);

    expect(service.refreshSc2Registrations('1')).toBe(registrations);
    // A second refresh while the first is in flight doesn't issue another request
    service.refreshSc2Registrations('1');
    expect(service.loadingSC2Registrations()).toBe(true);
    httpMock.expectOne(`${service['_apiEndpoint']}/tournament/sc2regs?tournamentId=1`).flush([{ id: 'r2' }]);

    expect(registrations()).toEqual([{ id: 'r2' }]);
    expect(service.loadingSC2Registrations()).toBe(false);

    service.refreshSc2Matches('1');
    httpMock.expectOne(`${service['_apiEndpoint']}/tournament/sc2matches?tournamentId=1`).flush([]);
    service.refreshSc2Groups('1');
    httpMock.expectOne(`${service['_apiEndpoint']}/tournament/sc2groups?tournamentId=1`).flush([]);
    service.refreshTournamentRegistrations('1');
    httpMock.expectOne(`${service['_apiEndpoint']}/tournament/tournamentregistrations?tournamentId=1`).flush([]);
  });

  it('should be safe to read per-id caches inside computed', () => {
    const id = signal('1');
    const matches = computed(() => service.getSc2Matches(id())());

    expect(matches()).toBeNull();
    httpMock.expectOne(`${service['_apiEndpoint']}/tournament/sc2matches?tournamentId=1`).flush([{ id: 'm1' }]);
    expect(matches()).toEqual([{ id: 'm1' }]);

    id.set('2');
    expect(matches()).toBeNull();
    httpMock.expectOne(`${service['_apiEndpoint']}/tournament/sc2matches?tournamentId=2`).flush([]);
    expect(matches()).toEqual([]);
  });

  it('should read a tournament from the loaded tournaments list', () => {
    service.tournaments();
    httpMock.expectOne(`${service['_apiEndpoint']}/tournament/tournaments`).flush([{ id: '1', name: 'Tournament 1' }]);

    expect(service.getTournament('1')()).toEqual({ id: '1', name: 'Tournament 1' });
    httpMock.expectNone(`${service['_apiEndpoint']}/tournament?id=1`);
  });

  it('should remove a deleted tournament from my tournaments', () => {
    const myTournaments = service.myTournaments;
    httpMock.expectOne(`${service['_apiEndpoint']}/tournament/mytournaments`).flush([{ id: '1' }, { id: '2' }]);

    service.deleteTournament('1').subscribe();
    httpMock.expectOne(`${service['_apiEndpoint']}/tournament/delete-tournament?id=1`).flush({});

    expect(myTournaments()).toEqual([{ id: '2' }]);
  });

  it('should keep the cached groups in sync when groups are added or deleted', () => {
    const csgoGroups = service.getCsgoGroups('1');
    httpMock.expectOne(`${service['_apiEndpoint']}/tournament/csgogroups?tournamentId=1`).flush([{ id: 'g1', name: 'Group A' }]);
    const sc2Groups = service.getSc2Groups('1');
    httpMock.expectOne(`${service['_apiEndpoint']}/tournament/sc2groups?tournamentId=1`).flush([{ id: 's1', name: 'Group A' }]);

    // The Counter-Strike group doesn't carry its tournament, so the cache is identified explicitly
    service.submitCSGOGroup({ name: 'Group B' }, '1').subscribe();
    httpMock.expectOne(`${service['_apiEndpoint']}/tournament/csgogroup`).flush({ id: 'g2', name: 'Group B' });
    expect(csgoGroups().map(g => g.id)).toEqual(['g1', 'g2']);

    // Re-submitting an existing group doesn't duplicate it
    service.submitCSGOGroup({ id: 'g2', name: 'Group B' }, '1').subscribe();
    httpMock.expectOne(`${service['_apiEndpoint']}/tournament/csgogroup?id=g2`).flush({ id: 'g2', name: 'Group B' });
    expect(csgoGroups().length).toBe(2);

    service.submitSC2Group({ name: 'Group B', tournamentId: '1' }).subscribe();
    httpMock.expectOne(`${service['_apiEndpoint']}/tournament/sc2group`).flush({ id: 's2', name: 'Group B', tournamentId: '1' });
    expect(sc2Groups().map(g => g.id)).toEqual(['s2', 's1']);

    service.deleteGroup('g1').subscribe();
    httpMock.expectOne(`${service['_apiEndpoint']}/tournament/group?id=g1`).flush({});
    expect(csgoGroups().map(g => g.id)).toEqual(['g2']);

    service.deleteGroup('s1').subscribe();
    httpMock.expectOne(`${service['_apiEndpoint']}/tournament/group?id=s1`).flush({});
    expect(sc2Groups().map(g => g.id)).toEqual(['s2']);
  });

  it('should submit a Counter-Strike group', () => {
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

  it('should delete a Counter-Strike group', () => {
    const mockGroupId = '1';

    service.deleteGroup(mockGroupId).subscribe(() => {
      expect(service['_csgoGroups'].get(mockGroupId)).toBeUndefined();
    });

    const req = httpMock.expectOne(`${service['_apiEndpoint']}/tournament/group?id=${mockGroupId}`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.withCredentials).toBe(true);
    req.flush({});
  });

  it('should add a participant to a Counter-Strike group', () => {
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

  it('should remove a participant from a Counter-Strike group', () => {
    const mockParticipantId = '1';
    const mockGroupId = '1';

    service.removeParticipantFromGroup(mockParticipantId, mockGroupId).subscribe();

    const req = httpMock.expectOne(`${service['_apiEndpoint']}/tournament/participanttogroup?id=${mockParticipantId}&groupid=${mockGroupId}`);
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

  it('should delete a StarCraft II group', () => {
    const mockGroupId = '1';

    service.deleteGroup(mockGroupId).subscribe();

    const req = httpMock.expectOne(`${service['_apiEndpoint']}/tournament/group?id=${mockGroupId}`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.withCredentials).toBe(true);
    req.flush({});
  });

  it('should add a participant to a StarCraft II group', () => {
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
      battleTag: 'test'
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

  it('should remove a participant from a StarCraft II group', () => {
    const mockParticipantId = '1';
    const mockGroupId = '1';

    service.removeParticipantFromGroup(mockParticipantId, mockGroupId).subscribe();

    const req = httpMock.expectOne(`${service['_apiEndpoint']}/tournament/participanttogroup?id=${mockParticipantId}&groupid=${mockGroupId}`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.withCredentials).toBe(true);
    req.flush({});
  });

  it('should submit participant points', () => {
    const mockParticipantId = '1';
    const mockGroupId = '1';
    const mockPoints = 10;

    service.submitParticipantPoints(mockParticipantId, mockGroupId, mockPoints).subscribe();

    const req = httpMock.expectOne(`${service['_apiEndpoint']}/tournament/participantpoints?participantId=${mockParticipantId}&groupId=${mockGroupId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ points: mockPoints });
    expect(req.request.withCredentials).toBe(true);
    req.flush({});
  });

  // it('should submit a Counter-Strike match map', () => {
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

  it('should delete a Counter-Strike match map', () => {
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

  describe('lazy signals', () => {
    it.each([
      ['tournaments', '/tournament/tournaments', false],
      ['activeTournament', '/tournament/activetournament', false],
      ['companies', '/companies', false],
      ['allRegistrations', '/tournament/allregistrations', true],
      ['myTournaments', '/tournament/mytournaments', true]
    ] as const)('should fetch %s once on first read and reuse the loaded value', (getter, path, withCredentials) => {
      const value = service[getter];
      // A second read while the first request is in flight doesn't duplicate it
      expect(service[getter]).toBeTruthy();

      const req = httpMock.expectOne(`${service['_apiEndpoint']}${path}`);
      expect(req.request.method).toBe('GET');
      expect(req.request.withCredentials).toBe(withCredentials);
      req.flush(getter === 'activeTournament' ? { id: 't1' } : [{ id: 'x' }]);

      expect(service[getter]()).toEqual(value());
      expect(value()).toBeTruthy();
      // Already loaded, so reading it again doesn't re-fetch
      service[getter]();
      httpMock.expectNone(`${service['_apiEndpoint']}${path}`);
    });

    it('should expose the tournaments list as the public tournaments', () => {
      const publicTournaments = service.publicTournaments;
      httpMock.expectOne(`${service['_apiEndpoint']}/tournament/tournaments`).flush([{ id: '1' }]);

      expect(publicTournaments()).toEqual([{ id: '1' }]);
      expect(service.tournaments()).toEqual([{ id: '1' }]);
      httpMock.expectNone(`${service['_apiEndpoint']}/tournament/tournaments`);
    });

    it('should fetch a tournament from the server when it is not in the loaded list', () => {
      service.tournaments();
      httpMock.expectOne(`${service['_apiEndpoint']}/tournament/tournaments`).flush([{ id: '1' }]);

      const tournament = service.getTournament('2');
      expect(tournament()).toBeNull();
      httpMock.expectOne(`${service['_apiEndpoint']}/tournament?id=2`).flush({ id: '2', name: 'Tournament 2' });
      expect(tournament()).toEqual({ id: '2', name: 'Tournament 2' });

      // Cached from then on
      expect(service.getTournament('2')()).toEqual({ id: '2', name: 'Tournament 2' });
      httpMock.expectNone(`${service['_apiEndpoint']}/tournament?id=2`);
    });
  });

  describe('per-id caches', () => {
    it('should fetch tournament registrations with credentials and toggle their loading flag', () => {
      const registrations = service.tournamentRegistrations('1');
      expect(service.loadingTourRegistrations()).toBe(true);
      expect(service.tournamentRegistrations('1')).toBe(registrations);

      const req = httpMock.expectOne(`${service['_apiEndpoint']}/tournament/tournamentregistrations?tournamentId=1`);
      expect(req.request.method).toBe('GET');
      expect(req.request.withCredentials).toBe(true);
      req.flush([{ id: 'r1' }]);

      expect(registrations()).toEqual([{ id: 'r1' }]);
      expect(service.loadingTourRegistrations()).toBe(false);
      expect(service.refreshTournamentRegistrations('1')).toBe(registrations);
      httpMock.expectOne(`${service['_apiEndpoint']}/tournament/tournamentregistrations?tournamentId=1`).flush([]);
      expect(registrations()).toEqual([]);
    });

    it.each([
      ['getCsgoRegistrations', 'loadingCSGORegistrations', '/tournament/csgoregs?tournamentId=1'],
      ['getSc2Registrations', 'loadingSC2Registrations', '/tournament/sc2regs?tournamentId=1'],
      ['getCsgoMatches', 'loadingCSGOMatches', '/tournament/csgomatches?tournamentId=1'],
      ['getSc2Matches', 'loadingSC2Matches', '/tournament/sc2matches?tournamentId=1'],
      // Counter-Strike groups share the registrations loading flag
      ['getCsgoGroups', 'loadingCSGORegistrations', '/tournament/csgogroups?tournamentId=1'],
      ['getSc2Groups', 'loadingSC2Groups', '/tournament/sc2groups?tournamentId=1']
    ] as const)('%s should set %s while the request is in flight', (method, flag, path) => {
      service[method]('1');
      expect(service[flag]()).toBe(true);
      httpMock.expectOne(`${service['_apiEndpoint']}${path}`).flush([]);
      expect(service[flag]()).toBe(false);
    });

    it.each([
      ['refreshSc2Registrations', 'getSc2Registrations', '/tournament/sc2regs?tournamentId=1'],
      ['refreshSc2Matches', 'getSc2Matches', '/tournament/sc2matches?tournamentId=1'],
      ['refreshSc2Groups', 'getSc2Groups', '/tournament/sc2groups?tournamentId=1'],
      ['refreshTournamentRegistrations', 'tournamentRegistrations', '/tournament/tournamentregistrations?tournamentId=1']
    ] as const)('%s should be skipped while the initial %s request is in flight', (refresh, get, path) => {
      const cached = service[get]('1');
      expect(service[refresh]('1')).toBe(cached);
      service[refresh]('1');

      httpMock.expectOne(`${service['_apiEndpoint']}${path}`).flush([{ id: 'a' }]);
      expect(cached()).toEqual([{ id: 'a' }]);
    });

    it('should keep the StarCraft II groups empty when the server returns none', () => {
      const groups = service.getSc2Groups('1');
      httpMock.expectOne(`${service['_apiEndpoint']}/tournament/sc2groups?tournamentId=1`).flush(null);
      expect(groups()).toBeNull();
      expect(service.loadingSC2Groups()).toBe(false);
    });

    it.each([
      ['getCsgoRegistrations', '/tournament/csgoregs'],
      ['getSc2Registrations', '/tournament/sc2regs'],
      ['getCsgoMatches', '/tournament/csgomatches'],
      ['getSc2Matches', '/tournament/sc2matches'],
      ['getCsgoGroups', '/tournament/csgogroups'],
      ['getSc2Groups', '/tournament/sc2groups']
    ] as const)('%s should omit the tournament filter for an empty id', (method, path) => {
      service[method]('');
      httpMock.expectOne(`${service['_apiEndpoint']}${path}`).flush([]);
    });
  });

  describe('failed fetches', () => {
    let unhandled: unknown[];
    let previousHandler: typeof rxjsConfig.onUnhandledError;

    // The caches subscribe without an error callback, so rxjs reports the HttpErrorResponse as unhandled
    // from a setTimeout; fake timers let each test collect it before the handler is restored.
    beforeEach(() => {
      vi.useFakeTimers({ toFake: ['setTimeout'] });
      unhandled = [];
      previousHandler = rxjsConfig.onUnhandledError;
      rxjsConfig.onUnhandledError = err => unhandled.push(err);
    });

    afterEach(() => {
      vi.runAllTimers();
      rxjsConfig.onUnhandledError = previousHandler;
      vi.useRealTimers();
    });

    const fail = (path: string) => httpMock.expectOne(`${service['_apiEndpoint']}${path}`)
      .error(new ProgressEvent('error'), { status: 500, statusText: 'Server Error' });

    it.each([
      ['tournaments', '/tournament/tournaments'],
      ['activeTournament', '/tournament/activetournament'],
      ['companies', '/companies'],
      ['allRegistrations', '/tournament/allregistrations'],
      ['myTournaments', '/tournament/mytournaments']
    ] as const)('should retry %s on the next read after an error', (getter, path) => {
      const value = service[getter];
      fail(path);
      expect(value()).toBeNull();

      service[getter]();
      httpMock.expectOne(`${service['_apiEndpoint']}${path}`).flush(getter === 'activeTournament' ? { id: 't1' } : []);
      expect(value()).toEqual(getter === 'activeTournament' ? { id: 't1' } : []);
    });

    it.each([
      ['getSc2Registrations', 'refreshSc2Registrations', 'loadingSC2Registrations', '/tournament/sc2regs?tournamentId=1'],
      ['getSc2Matches', 'refreshSc2Matches', 'loadingSC2Matches', '/tournament/sc2matches?tournamentId=1'],
      ['getSc2Groups', 'refreshSc2Groups', 'loadingSC2Groups', '/tournament/sc2groups?tournamentId=1'],
      ['tournamentRegistrations', 'refreshTournamentRegistrations', 'loadingTourRegistrations',
        '/tournament/tournamentregistrations?tournamentId=1']
    ] as const)('%s should clear %s and allow a refresh after an error', (get, refresh, flag, path) => {
      const cached = service[get]('1');
      expect(service[flag]()).toBe(true);
      fail(path);

      expect(service[flag]()).toBe(false);
      expect(cached()).toBeNull();
      vi.runAllTimers();
      expect(unhandled).toEqual([expect.objectContaining({ status: 500 })]);

      service[refresh]('1');
      expect(service[flag]()).toBe(true);
      httpMock.expectOne(`${service['_apiEndpoint']}${path}`).flush([{ id: 'a' }]);
      expect(cached()).toEqual([{ id: 'a' }]);
      expect(service[flag]()).toBe(false);
    });

    it.each([
      ['getCsgoRegistrations', 'loadingCSGORegistrations', '/tournament/csgoregs?tournamentId=1'],
      ['getCsgoMatches', 'loadingCSGOMatches', '/tournament/csgomatches?tournamentId=1'],
      ['getCsgoGroups', 'loadingCSGORegistrations', '/tournament/csgogroups?tournamentId=1']
    ] as const)('%s should clear %s after an error', (method, flag, path) => {
      const cached = service[method]('1');
      fail(path);
      expect(service[flag]()).toBe(false);
      expect(cached()).toBeNull();
    });

    it('should leave a tournament empty when it fails to load', () => {
      const tournament = service.getTournament('1');
      fail('/tournament?id=1');
      expect(tournament()).toBeNull();
    });
  });

  describe('mutations', () => {
    let emitSuccess: ReturnType<typeof vi.spyOn>;
    let emitError: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      emitSuccess = vi.spyOn(commsService, 'emitSuccess');
      emitError = vi.spyOn(commsService, 'emitError');
    });

    interface MutationCase {
      name: string;
      call: (s: ApiTournamentsService) => Observable<unknown>;
      method: string;
      path: string;
      body?: unknown;
      response?: unknown;
      success?: string;
    }

    const reg: TournamentApplication = { id: 'r1', email: 'test@mail.com', game: Game.CSGO };
    const participant = { id: 'p1', userId: 'u1' } as TournamentParticipant;

    const cases: MutationCase[] = [
      { name: 'leagueRegistration', call: s => s.leagueRegistration(reg), method: 'POST', path: '/tournament/register', body: reg },
      { name: 'bgeRegistration', call: s => s.bgeRegistration(reg, 't1'), method: 'PUT',
        path: '/tournament/registerbge?tournamentId=t1', body: reg },
      { name: 'bgeRegistration without a tournament', call: s => s.bgeRegistration(reg), method: 'PUT',
        path: '/tournament/registerbge?tournamentId=', body: reg },
      { name: 'createTournament', call: s => s.createTournament({ name: 'T' }), method: 'PUT', path: '/tournament/create',
        body: { name: 'T' }, success: 'Tournament updated successfully!' },
      { name: 'updateTournament', call: s => s.updateTournament({ id: 't1', name: 'T' }), method: 'PUT', path: '/tournament/create',
        body: { id: 't1', name: 'T' }, success: 'Tournament updated successfully!' },
      { name: 'resetCheckinState', call: s => s.resetCheckinState('t1'), method: 'GET', path: '/tournament/resetstate?tournamentId=t1',
        response: { message: 'State reset' }, success: 'State reset' },
      { name: 'sendCheckinEmails', call: s => s.sendCheckinEmails('t1'), method: 'GET',
        path: '/tournament/sendcheckinemails?tournamentId=t1', response: { message: 'Emails sent' }, success: 'Emails sent' },
      { name: 'confirmRegistration', call: s => s.confirmRegistration(reg), method: 'PUT', path: '/tournament/confirm?id=r1', body: reg,
        success: 'Tournament application updated successfully!' },
      { name: 'weeklyCheckin', call: s => s.weeklyCheckin(reg), method: 'PUT', path: '/tournament/checkin?id=r1', body: reg,
        success: 'Tournament application updated successfully!' },
      { name: 'deleteRegistration', call: s => s.deleteRegistration('r1'), method: 'DELETE', path: '/tournament/delete?id=r1',
        success: 'Tournament application deleted successfully!' },
      { name: 'submitCSGOGroup', call: s => s.submitCSGOGroup({ id: 'g1', name: 'A' }), method: 'PUT', path: '/tournament/csgogroup?id=g1',
        body: { id: 'g1', name: 'A' }, success: 'Tournament Counter-Strike group updated successfully!' },
      { name: 'addParticipantToGroup', call: s => s.addParticipantToGroup(participant, 'g1'), method: 'PUT',
        path: '/tournament/participanttogroup?id=g1', body: participant, success: 'Tournament participant added to group successfully!' },
      { name: 'removeParticipantFromGroup', call: s => s.removeParticipantFromGroup('p1', 'g1'), method: 'DELETE',
        path: '/tournament/participanttogroup?id=p1&groupid=g1', success: 'Tournament participant deleted from group successfully!' },
      { name: 'submitSC2Group', call: s => s.submitSC2Group({ id: 's1', name: 'A' }), method: 'PUT', path: '/tournament/sc2group?id=s1',
        body: { id: 's1', name: 'A' }, success: 'Tournament StarCraft 2 group updated successfully!' },
      { name: 'submitParticipantPoints', call: s => s.submitParticipantPoints('p1', 'g1', 3), method: 'PUT',
        path: '/tournament/participantpoints?participantId=p1&groupId=g1', body: { points: 3 },
        success: 'Tournament participant points updated successfully!' },
      { name: 'submitCSGOMatch', call: s => s.submitCSGOMatch({ id: 'm1' }), method: 'PUT', path: '/tournament/csgomatch?id=m1',
        body: { id: 'm1' }, success: 'Tournament Counter-Strike match updated successfully!' },
      { name: 'deleteCSGOMatch', call: s => s.deleteCSGOMatch({ id: 'm1' }), method: 'DELETE', path: '/tournament/csgomatch?id=m1',
        success: 'Tournament Counter-Strike match deleted successfully!' },
      { name: 'deleteCSGOMatchMap', call: s => s.deleteCSGOMatchMap('mm1'), method: 'DELETE', path: '/tournament/csgomatchmap?id=mm1',
        success: 'Tournament Counter-Strike match map deleted successfully!' },
      { name: 'submitSC2Match', call: s => s.submitSC2Match({ id: 'm1' }), method: 'PUT', path: '/tournament/sc2match?id=m1',
        body: { id: 'm1' }, success: 'Tournament StarCraft II match updated successfully!' },
      { name: 'deleteSC2Match', call: s => s.deleteSC2Match({ id: 'm1' }), method: 'DELETE', path: '/tournament/sc2match?id=m1',
        success: 'Tournament StarCraft II match deleted successfully!' },
      { name: 'deleteSC2MatchMap', call: s => s.deleteSC2MatchMap('mm1'), method: 'DELETE', path: '/tournament/sc2matchmap?id=mm1',
        success: 'Tournament StarCraft II match map deleted successfully!' },
      { name: 'joinByInviteCode', call: s => s.joinByInviteCode('CODE'), method: 'POST', path: '/tournament/join',
        body: { inviteCode: 'CODE' }, response: { id: 't1' }, success: 'Successfully joined tournament!' },
      { name: 'deleteTournament', call: s => s.deleteTournament('t1'), method: 'DELETE', path: '/tournament/delete-tournament?id=t1',
        success: 'Tournament deleted successfully!' }
    ];

    it.each(cases)('$name should send $method $path with credentials and report success', c => {
      const response = c.response ?? { id: 'response' };
      const next = vi.fn();
      c.call(service).subscribe(next);

      const req = httpMock.expectOne(`${service['_apiEndpoint']}${c.path}`);
      expect(req.request.method).toBe(c.method);
      expect(req.request.withCredentials).toBe(true);
      if (c.body !== undefined) {
        expect(req.request.body).toEqual(c.body);
      }
      req.flush(response);

      expect(next).toHaveBeenCalledWith(response);
      if (c.success) {
        expect(emitSuccess).toHaveBeenCalledWith(c.success);
      } else {
        expect(emitSuccess).not.toHaveBeenCalled();
      }
      expect(emitError).not.toHaveBeenCalled();
    });

    it.each(cases)('$name should report the error and rethrow it', c => {
      const error = vi.fn();
      c.call(service).subscribe({ error });

      const url = `${service['_apiEndpoint']}${c.path}`;
      httpMock.expectOne(url).error(new ProgressEvent('error'), { status: 500, statusText: 'Server Error' });

      const message = `Http failure response for ${url}: 500 Server Error`;
      expect(emitError).toHaveBeenCalledWith(message);
      expect(error).toHaveBeenCalledWith(expect.objectContaining({ message, status: 500 }));
      expect(emitSuccess).not.toHaveBeenCalled();
    });

    it('should submit new matches without an id in the url', () => {
      service.submitSC2Match({ player1Id: 'a' }).subscribe();
      const req = httpMock.expectOne(`${service['_apiEndpoint']}/tournament/sc2match`);
      expect(req.request.withCredentials).toBe(true);
      req.flush({ id: 'm1' });
    });

    it('should keep my tournaments unloaded when deleting before they were fetched', () => {
      service.deleteTournament('t1').subscribe();
      httpMock.expectOne(`${service['_apiEndpoint']}/tournament/delete-tournament?id=t1`).flush({});
      expect(service['_myTournaments']()).toBeNull();
    });

    it('should keep my tournaments when deleting a tournament fails', () => {
      const myTournaments = service.myTournaments;
      httpMock.expectOne(`${service['_apiEndpoint']}/tournament/mytournaments`).flush([{ id: 't1' }]);

      service.deleteTournament('t1').subscribe({ error: () => undefined });
      httpMock.expectOne(`${service['_apiEndpoint']}/tournament/delete-tournament?id=t1`)
        .error(new ProgressEvent('error'), { status: 500, statusText: 'Server Error' });
      expect(myTournaments()).toEqual([{ id: 't1' }]);
    });

    it('should keep the group caches when deleting a group fails, without reporting it', () => {
      const csgoGroups = service.getCsgoGroups('1');
      httpMock.expectOne(`${service['_apiEndpoint']}/tournament/csgogroups?tournamentId=1`).flush([{ id: 'g1', name: 'A' }]);

      const error = vi.fn();
      service.deleteGroup('g1').subscribe({ error });
      httpMock.expectOne(`${service['_apiEndpoint']}/tournament/group?id=g1`)
        .error(new ProgressEvent('error'), { status: 500, statusText: 'Server Error' });

      expect(error).toHaveBeenCalled();
      expect(csgoGroups()).toEqual([{ id: 'g1', name: 'A' }]);
      expect(emitError).not.toHaveBeenCalled();
    });

    it('should remove a deleted group from the caches of every tournament', () => {
      const csgo1 = service.getCsgoGroups('1');
      httpMock.expectOne(`${service['_apiEndpoint']}/tournament/csgogroups?tournamentId=1`).flush([{ id: 'g1', name: 'A' }]);
      const csgo2 = service.getCsgoGroups('2');
      httpMock.expectOne(`${service['_apiEndpoint']}/tournament/csgogroups?tournamentId=2`).flush([{ id: 'g2', name: 'B' }]);
      const sc2 = service.getSc2Groups('1');
      // Still in flight, so there is nothing to remove from it yet
      service.deleteGroup('g2').subscribe();
      httpMock.expectOne(`${service['_apiEndpoint']}/tournament/group?id=g2`).flush({});

      expect(csgo1()).toEqual([{ id: 'g1', name: 'A' }]);
      expect(csgo2()).toEqual([]);
      expect(sc2()).toBeNull();
      httpMock.expectOne(`${service['_apiEndpoint']}/tournament/sc2groups?tournamentId=1`).flush([]);
    });

    it('should add a new group to the cache of the tournament returned by the server', () => {
      const csgoGroups = service.getCsgoGroups('1');
      httpMock.expectOne(`${service['_apiEndpoint']}/tournament/csgogroups?tournamentId=1`).flush([{ id: 'g1', name: 'A' }]);
      const sc2Groups = service.getSc2Groups('1');
      httpMock.expectOne(`${service['_apiEndpoint']}/tournament/sc2groups?tournamentId=1`).flush([{ id: 's1', name: 'A' }]);

      service.submitCSGOGroup({ name: 'B' }).subscribe();
      httpMock.expectOne(`${service['_apiEndpoint']}/tournament/csgogroup`).flush({ id: 'g2', name: 'B', tournamentId: '1' });
      service.submitSC2Group({ name: 'B' }).subscribe();
      httpMock.expectOne(`${service['_apiEndpoint']}/tournament/sc2group`).flush({ id: 's2', name: 'B', tournamentId: '1' });

      expect(csgoGroups().map(g => g.id)).toEqual(['g1', 'g2']);
      expect(sc2Groups().map(g => g.id)).toEqual(['s2', 's1']);
    });

    it('should not touch the group caches when the tournament is unknown or not loaded', () => {
      const csgoGroups = service.getCsgoGroups('1');
      httpMock.expectOne(`${service['_apiEndpoint']}/tournament/csgogroups?tournamentId=1`).flush([{ id: 'g1', name: 'A' }]);

      // No tournament anywhere
      service.submitCSGOGroup({ name: 'B' }).subscribe();
      httpMock.expectOne(`${service['_apiEndpoint']}/tournament/csgogroup`).flush({ id: 'g2', name: 'B' });
      // A tournament whose groups were never loaded
      service.submitCSGOGroup({ name: 'C', tournamentId: '2' }).subscribe();
      httpMock.expectOne(`${service['_apiEndpoint']}/tournament/csgogroup`).flush({ id: 'g3', name: 'C', tournamentId: '2' });
      service.submitSC2Group({ name: 'C', tournamentId: '2' }).subscribe();
      httpMock.expectOne(`${service['_apiEndpoint']}/tournament/sc2group`).flush({ id: 's3', name: 'C', tournamentId: '2' });
      // An empty response
      service.submitCSGOGroup({ name: 'D' }, '1').subscribe();
      httpMock.expectOne(`${service['_apiEndpoint']}/tournament/csgogroup`).flush(null);

      expect(csgoGroups()).toEqual([{ id: 'g1', name: 'A' }]);
      expect(service['_csgoGroups'].has('2')).toBe(false);
      expect(service['_sc2Groups'].has('2')).toBe(false);
    });

    it('should not add a group to a cache that is still loading', () => {
      const sc2Groups = service.getSc2Groups('1');
      service.submitSC2Group({ name: 'B', tournamentId: '1' }).subscribe();
      httpMock.expectOne(`${service['_apiEndpoint']}/tournament/sc2group`).flush({ id: 's2', name: 'B', tournamentId: '1' });
      expect(sc2Groups()).toBeNull();

      httpMock.expectOne(`${service['_apiEndpoint']}/tournament/sc2groups?tournamentId=1`).flush([{ id: 's1', name: 'A' }, { id: 's2', name: 'B' }]);
      expect(sc2Groups().map(g => g.id)).toEqual(['s2', 's1']);
    });

    it('should not change the group caches when saving a group fails', () => {
      const csgoGroups = service.getCsgoGroups('1');
      httpMock.expectOne(`${service['_apiEndpoint']}/tournament/csgogroups?tournamentId=1`).flush([{ id: 'g1', name: 'A' }]);

      service.submitCSGOGroup({ name: 'B' }, '1').subscribe({ error: () => undefined });
      httpMock.expectOne(`${service['_apiEndpoint']}/tournament/csgogroup`)
        .error(new ProgressEvent('error'), { status: 500, statusText: 'Server Error' });

      expect(csgoGroups()).toEqual([{ id: 'g1', name: 'A' }]);
    });
  });
});
