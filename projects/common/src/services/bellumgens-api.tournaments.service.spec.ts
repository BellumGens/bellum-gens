import { TestBed } from '@angular/core/testing';

import { ApiTournamentsService } from './bellumgens-api.tournaments.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TournamentCSGOMatch } from '../models/tournament-schedule';

describe('ApiTournamentsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [ HttpClientTestingModule ]
  }));

  it('should be created', () => {
    const service: ApiTournamentsService = TestBed.inject(ApiTournamentsService);
    expect(service).toBeTruthy();
  });

});
describe('ApiTournamentsService', () => {
  let service: ApiTournamentsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ ApiTournamentsService ]
    });
    service = TestBed.inject(ApiTournamentsService);
    httpMock = TestBed.inject(HttpTestingController);
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

    service.createTournament(mockTournament).subscribe(tournament => {
      expect(tournament).toEqual({ id: '1', ...mockTournament });
    });

    const req = httpMock.expectOne(`${service['_apiEndpoint']}/tournament/create`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockTournament);
    expect(req.request.withCredentials).toBe(true);
    req.flush({ id: '1', ...mockTournament });
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
    req.flush({ id: '1', ...mockMatch });
  });

  it('should delete a CS:GO match', () => {
    const mockMatchId = '1';

    service.deleteCSGOMatch({ id: mockMatchId } as TournamentCSGOMatch).subscribe(() => {
      expect(service['_csgoMatches'].get(mockMatchId)).toBeUndefined();
    });

    const req = httpMock.expectOne(`${service['_apiEndpoint']}/tournament/csgomatch?id=${mockMatchId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
