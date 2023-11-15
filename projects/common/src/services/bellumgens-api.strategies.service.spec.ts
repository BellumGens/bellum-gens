import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CSGOStrategy, Side, StrategyComment, VoteDirection } from '../models/csgostrategy';
import { ApiStrategiesService } from './bellumgens-api.strategies.service';
import { CSGOMap } from '../public_api';

describe('ApiStrategiesService', () => {
  let service: ApiStrategiesService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [ HttpClientTestingModule ]});
    service = TestBed.inject(ApiStrategiesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load strategies page on `strategies` getter', () => {
    const page = 0;
    const sub = service.strategies.subscribe();
    const req = httpMock.expectOne(`${service['_apiEndpoint']}/strategy/strategies?page=${page}`);
    expect(req.request.method).toEqual('GET');
    req.flush([]);
    expect(service['_strategies'].value).toEqual([]);
    sub.unsubscribe();
  });

  it('should load strategies page', () => {
    const page = 0;
    service.loadStrategiesPage(page);
    const req = httpMock.expectOne(`${service['_apiEndpoint']}/strategy/strategies?page=${page}`);
    expect(req.request.method).toEqual('GET');
    req.flush([]);
    expect(service['_strategies'].value).toEqual([]);
  });

  it('should get user strategies', () => {
    const userId = '123';
    service.getUserStrategies(userId).subscribe();
    const req = httpMock.expectOne(`${service['_apiEndpoint']}/strategy/userstrats?userid=${userId}`);
    expect(req.request.method).toEqual('GET');
    expect(req.request.withCredentials).toEqual(true);
    req.flush([]);
    expect(service['_strategies'].value).toEqual([]);
  });

  it('should get team strat', () => {
    const stratId = '012';
    service.getTeamStrat(stratId).subscribe();
    const req = httpMock.expectOne(`${service['_apiEndpoint']}/strategy/strat?stratId=${stratId}`);
    expect(req.request.method).toEqual('GET');
    expect(req.request.withCredentials).toEqual(true);
    req.flush({});
  });

  it('should get team strats', () => {
    const teamId = '123';
    service.getTeamStrats(teamId).subscribe();
    const req = httpMock.expectOne(`${service['_apiEndpoint']}/strategy/teamstrats?teamid=${teamId}`);
    expect(req.request.method).toEqual('GET');
    expect(req.request.withCredentials).toEqual(true);
    req.flush([]);
    expect(service['_strategies'].value).toEqual([]);
  });

  it('should get team map pool', () => {
    const teamId = '123';
    service.getTeamMapPool(teamId).subscribe();
    const req = httpMock.expectOne(`${service['_apiEndpoint']}/teams/mapPool?teamId=${teamId}`);
    expect(req.request.method).toEqual('GET');
    expect(req.request.withCredentials).toEqual(true);
    req.flush([]);
    expect(service['_strategies'].value).toEqual([]);
  });

  it('should get strategy', () => {
    const stratId = '123456789';
    service.getStrategy(stratId);
    const req = httpMock.expectOne(`${service['_apiEndpoint']}/strategy/strat?stratId=${stratId}`);
    expect(req.request.method).toEqual('GET');
    expect(req.request.withCredentials).toEqual(true);
    req.flush({
      id: '123456789',
      title: 'Test',
      description: 'Test',
      map: CSGOMap.Dust2,
      side: Side.TSide,
      teamId: '123',
      url: 'test'
    });
    expect(service['_strategyCache'].get(stratId).value).toEqual({
      id: '123456789',
      title: 'Test',
      description: 'Test',
      map: CSGOMap.Dust2,
      side: Side.TSide,
      teamId: '123',
      url: 'test'
    });
  });

  it('should submit strategy', () => {
    const strat: CSGOStrategy = {
      id: '123456',
      title: 'Test 1',
      description: 'Test 2',
      map: CSGOMap.Dust2,
      side: Side.TSide,
      teamId: '123',
      url: 'test.com'
    };
    service.submitStrategy(strat).subscribe();
    const req = httpMock.expectOne(`${service['_apiEndpoint']}/strategy/strategy`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(strat);
    expect(req.request.withCredentials).toEqual(true);
    req.flush(strat);
    expect(service['_strategyCache'].get(strat.id).value).toEqual({
      id: '123456',
      title: 'Test 1',
      description: 'Test 2',
      map: CSGOMap.Dust2,
      side: Side.TSide,
      teamId: '123',
      url: 'test.com'
    });
  });

  it('should submit strat vote', () => {
    const strat: CSGOStrategy = {
      id: '123',
      title: 'Test',
      description: 'Test',
      map: CSGOMap.Dust2,
      side: Side.TSide,
      teamId: '123',
      url: 'test',
      votes: []
    };
    const direction = VoteDirection.Up;
    const userId = '123';
    service.submitStratVote(strat, direction, userId).subscribe();
    const req = httpMock.expectOne(`${service['_apiEndpoint']}/strategy/vote`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({ id: strat.id, direction });
    expect(req.request.withCredentials).toEqual(true);
    req.flush({});
  });

  it('should submit strat comment', () => {
    const comment: StrategyComment = { id: '123', stratId: '456', comment: 'Test', userId: '123', published: new Date() };
    const strat: CSGOStrategy = {
      id: '456',
      title: 'Test',
      description: 'Test',
      map: CSGOMap.Dust2,
      side: Side.TSide,
      teamId: '123',
      url: 'test',
      comments: []
    };
    service.submitStratComment(comment, strat).subscribe();
    const req = httpMock.expectOne(`${service['_apiEndpoint']}/strategy/comment`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(comment);
    expect(req.request.withCredentials).toEqual(true);
    req.flush({});
  });

  it('should delete strat comment', () => {
    const comment: StrategyComment = { id: '123', stratId: '456', comment: 'Test', userId: '123', published: new Date() };
    const strat: CSGOStrategy = {
      id: '456',
      title: 'Test',
      description: 'Test',
      map: CSGOMap.Dust2,
      side: Side.TSide,
      teamId: '123',
      url: 'test',
      comments: [
        { id: '123', stratId: '456', comment: 'Test', userId: '123', published: new Date() }
      ]
    };
    service.deleteStratComment(comment, strat).subscribe();
    const req = httpMock.expectOne(`${service['_apiEndpoint']}/strategy/comment?id=${comment.id}`);
    expect(req.request.method).toEqual('DELETE');
    expect(req.request.withCredentials).toEqual(true);
    req.flush({});
  });

  it('should delete strategy', () => {
    const stratId = '345';
    service.deleteStrategy(stratId).subscribe();
    const req = httpMock.expectOne(`${service['_apiEndpoint']}/strategy/strat?id=${stratId}`);
    expect(req.request.method).toEqual('DELETE');
    expect(req.request.withCredentials).toEqual(true);
    req.flush({});
  });

  it('should handle errors', () => {
    const stratId = '234';
    service.getTeamStrat(stratId).subscribe({
      next: () => fail('Should not succeed'),
      error: (error) => expect(error.status).toEqual(404)
    });
    const req = httpMock.expectOne(`${service['_apiEndpoint']}/strategy/strat?stratId=${stratId}`);
    expect(req.request.method).toEqual('GET');
    req.error(new ProgressEvent('Not Found'), { status: 404, statusText: 'Not Found' });
  });
});
