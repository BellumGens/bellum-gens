import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CSGOStrategy, Side, StrategyComment, StrategyVote, VoteDirection } from '../models/csgostrategy';
import { ApiStrategiesService } from './bellumgens-api.strategies.service';
import { CSGOMap, CommunicationService } from '../public_api';

describe('ApiStrategiesService', () => {
  let service: ApiStrategiesService;
  let httpMock: HttpTestingController;
  let commsService: CommunicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [ HttpClientTestingModule ]});
    service = TestBed.inject(ApiStrategiesService);
    httpMock = TestBed.inject(HttpTestingController);
    commsService = TestBed.inject(CommunicationService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load strategies page on `strategies` getter', () => {
    const page = 0;
    const errorMessage = `Http failure response for ${service['_apiEndpoint']}/strategy/strategies?page=${page}: 500 Could not retrieve strategies!`;
    commsService.error.subscribe(message => expect(message).toEqual(errorMessage));
    let sub = service.strategies.subscribe({
      error: error => expect(error.message).toEqual(errorMessage)
    });
    const req2 = httpMock.expectOne(`${service['_apiEndpoint']}/strategy/strategies?page=${page}`);
    expect(req2.request.method).toEqual('GET');
    expect(service.loadingStrategies.value).toEqual(true);
    req2.error(new ProgressEvent('Server Error'), { status: 500, statusText: 'Could not retrieve strategies!' });
    expect(service.loadingStrategies.value).toEqual(false);
    sub.unsubscribe();

    sub = service.strategies.subscribe();
    const req = httpMock.expectOne(`${service['_apiEndpoint']}/strategy/strategies?page=${page}`);
    expect(req.request.method).toEqual('GET');
    expect(service.loadingStrategies.value).toEqual(true);
    req.flush([]);
    expect(service.loadingStrategies.value).toEqual(false);
    expect(service['_strategies'].value).toEqual([]);
    sub.unsubscribe();
  });

  it('should load strategies page', () => {
    const page = 0;
    service.loadStrategiesPage(page);
    const req = httpMock.expectOne(`${service['_apiEndpoint']}/strategy/strategies?page=${page}`);
    expect(req.request.method).toEqual('GET');
    expect(service.loadingStrategies.value).toEqual(true);
    req.flush([]);
    expect(service.loadingStrategies.value).toEqual(false);
    expect(service['_strategies'].value).toEqual([]);

    const errorMessage = `Http failure response for ${service['_apiEndpoint']}/strategy/strategies?page=${page}: 500 Could not retrieve strategies!`;
    commsService.error.subscribe(message => expect(message).toEqual(errorMessage));
    service.loadStrategiesPage(page);
    const req2 = httpMock.expectOne(`${service['_apiEndpoint']}/strategy/strategies?page=${page}`);
    expect(req2.request.method).toEqual('GET');
    expect(service.loadingStrategies.value).toEqual(true);
    req2.error(new ProgressEvent('Server Error'), { status: 500, statusText: 'Could not retrieve strategies!' });
    expect(service.loadingStrategies.value).toEqual(false);
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
    commsService.success.subscribe(message => expect(message).toEqual('Strategy saved!'));
    service.submitStrategy(strat).subscribe();
    const req = httpMock.expectOne(`${service['_apiEndpoint']}/strategy/strategy`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(strat);
    expect(req.request.withCredentials).toEqual(true);
    req.flush(strat);
    expect(service['_strategyCache'].get(strat.id).value).toEqual(strat);

    const strat2: CSGOStrategy = {
      id: '123456',
      title: 'Test 1',
      description: 'Test 2',
      map: CSGOMap.Dust2,
      side: Side.TSide,
      teamId: '123',
      url: 'test.com',
      comments: []
    };
    const errorMessage = `Http failure response for ${service['_apiEndpoint']}/strategy/strategy: 500 Could not save strategy!`;
    commsService.error.subscribe(message => expect(message).toEqual(errorMessage));
    service.submitStrategy(strat2).subscribe({
      next: () => fail('Should not succeed'),
      error: error => expect(error.message).toEqual(errorMessage)
    });
    const req2 = httpMock.expectOne(`${service['_apiEndpoint']}/strategy/strategy`);
    expect(req2.request.method).toEqual('POST');
    expect(req2.request.body).toEqual(strat2);
    expect(req2.request.withCredentials).toEqual(true);
    req2.error(new ProgressEvent('Server Error'), { status: 500, statusText: 'Could not save strategy!' });

    // Should update the strategy cache if the strategy is already cached
    const strat3: CSGOStrategy = {
      id: '123456',
      title: 'Test 1',
      description: 'Test 2',
      map: CSGOMap.Dust2,
      side: Side.TSide,
      teamId: '123',
      url: 'test.com',
      comments: []
    };
    commsService.success.subscribe(message => expect(message).toEqual('Strategy saved!'));
    service.submitStrategy(strat3).subscribe();
    const req3 = httpMock.expectOne(`${service['_apiEndpoint']}/strategy/strategy`);
    expect(req3.request.method).toEqual('POST');
    expect(req3.request.body).toEqual(strat3);
    expect(req3.request.withCredentials).toEqual(true);
    req3.flush(strat3);
    expect(service['_strategyCache'].get(strat3.id).value).toEqual(strat3);
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
    const vote: StrategyVote = { userId: userId, vote: direction };
    let sub = commsService.success.subscribe(message => expect(message).toEqual('Vote submitted successfully!'));
    service.submitStratVote(strat, direction, userId).subscribe();
    const req = httpMock.expectOne(`${service['_apiEndpoint']}/strategy/vote`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual({ id: strat.id, direction });
    expect(req.request.withCredentials).toEqual(true);
    req.flush(vote);
    sub.unsubscribe();

    // Should update the vote if the user already voted
    const vote2: StrategyVote = { userId: userId, vote: VoteDirection.Down };
    sub = commsService.success.subscribe(message => expect(message).toEqual('Vote submitted successfully!'));
    service.submitStratVote(strat, VoteDirection.Down, userId).subscribe();
    const req2 = httpMock.expectOne(`${service['_apiEndpoint']}/strategy/vote`);
    expect(req2.request.method).toEqual('POST');
    expect(req2.request.body).toEqual({ id: strat.id, direction: VoteDirection.Down });
    expect(req2.request.withCredentials).toEqual(true);
    req2.flush(vote2);
    expect(strat.votes.find(v => v.userId === userId).vote).toEqual(vote2.vote);
    sub.unsubscribe();

    // Should remove the vote if the user already voted and the direction is the same
    sub = commsService.success.subscribe(message => expect(message).toEqual('Vote removed successfully!'));
    service.submitStratVote(strat, VoteDirection.Down, userId).subscribe();
    const req4 = httpMock.expectOne(`${service['_apiEndpoint']}/strategy/vote`);
    expect(req4.request.method).toEqual('POST');
    expect(req4.request.body).toEqual({ id: strat.id, direction: VoteDirection.Down });
    expect(req4.request.withCredentials).toEqual(true);
    req4.flush(null);
    expect(strat.votes.find(v => v.userId === userId)).toBeUndefined();
    sub.unsubscribe();

    const errorMessage = `Http failure response for ${service['_apiEndpoint']}/strategy/vote: 500 Could not submit vote!`;
    commsService.error.subscribe(message => expect(message).toEqual(errorMessage));
    service.submitStratVote(strat, direction, userId).subscribe({
      next: () => fail('Should not succeed'),
      error: error => expect(error.message).toEqual(errorMessage)
    });
    const req3 = httpMock.expectOne(`${service['_apiEndpoint']}/strategy/vote`);
    expect(req3.request.method).toEqual('POST');
    expect(req3.request.body).toEqual({ id: strat.id, direction });
    expect(req3.request.withCredentials).toEqual(true);
    req3.error(new ProgressEvent('Server Error'), { status: 500, statusText: 'Could not submit vote!' });
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
    const sub = commsService.success.subscribe(message => expect(message).toEqual('Comment submitted successfully!'));
    service.submitStratComment(comment, strat).subscribe();
    const req = httpMock.expectOne(`${service['_apiEndpoint']}/strategy/comment`);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(comment);
    expect(req.request.withCredentials).toEqual(true);
    req.flush(comment);
    sub.unsubscribe();

    // Should update the comment if the comment is already cached
    const comment2: StrategyComment = { id: '123', stratId: '456', comment: 'Updated test comment', userId: '123', published: new Date() };
    commsService.success.subscribe(message => expect(message).toEqual('Comment edited successfully!'));
    service.submitStratComment(comment2, strat).subscribe();
    const req2 = httpMock.expectOne(`${service['_apiEndpoint']}/strategy/comment`);
    expect(req2.request.method).toEqual('POST');
    expect(req2.request.body).toEqual(comment2);
    expect(req2.request.withCredentials).toEqual(true);
    req2.flush(comment2);
    expect(strat.comments.find(c => c.id === comment2.id).comment).toEqual(comment2.comment);

    const errorMessage = `Http failure response for ${service['_apiEndpoint']}/strategy/comment: 500 Could not submit comment!`;
    commsService.error.subscribe(message => expect(message).toEqual(errorMessage));
    service.submitStratComment(comment, strat).subscribe({
      next: () => fail('Should not succeed'),
      error: error => expect(error.message).toEqual(errorMessage)
    });
    const req3 = httpMock.expectOne(`${service['_apiEndpoint']}/strategy/comment`);
    expect(req3.request.method).toEqual('POST');
    expect(req3.request.body).toEqual(comment);
    expect(req3.request.withCredentials).toEqual(true);
    req3.error(new ProgressEvent('Server Error'), { status: 500, statusText: 'Could not submit comment!' });
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
    commsService.success.subscribe(message => expect(message).toEqual('Comment deleted successfully!'));
    service.deleteStratComment(comment, strat).subscribe();
    const req = httpMock.expectOne(`${service['_apiEndpoint']}/strategy/comment?id=${comment.id}`);
    expect(req.request.method).toEqual('DELETE');
    expect(req.request.withCredentials).toEqual(true);
    req.flush({});
    expect(strat.comments.length).toEqual(0);

    const errorMessage = `Http failure response for ${service['_apiEndpoint']}/strategy/comment?id=${comment.id}: 500 Could not delete comment!`;
    commsService.error.subscribe(message => expect(message).toEqual(errorMessage));
    service.deleteStratComment(comment, strat).subscribe({
      next: () => fail('Should not succeed'),
      error: error => expect(error.message).toEqual(errorMessage)
    });
    const req2 = httpMock.expectOne(`${service['_apiEndpoint']}/strategy/comment?id=${comment.id}`);
    expect(req2.request.method).toEqual('DELETE');
    expect(req2.request.withCredentials).toEqual(true);
    req2.error(new ProgressEvent('Server Error'), { status: 500, statusText: 'Could not delete comment!' });
  });

  it('should delete strategy', () => {
    const stratId = '345';
    commsService.success.subscribe(message => expect(message).toEqual('Strategy successfully deleted!'));
    service.deleteStrategy(stratId).subscribe();
    const req = httpMock.expectOne(`${service['_apiEndpoint']}/strategy/strat?id=${stratId}`);
    expect(req.request.method).toEqual('DELETE');
    expect(req.request.withCredentials).toEqual(true);
    req.flush({});

    const errorMessage = `Http failure response for ${service['_apiEndpoint']}/strategy/strat?id=${stratId}: 500 Could not delete strategy!`;
    commsService.error.subscribe(message => expect(message).toEqual(errorMessage));
    service.deleteStrategy(stratId).subscribe({
      next: () => fail('Should not succeed'),
      error: error => expect(error.message).toEqual(errorMessage)
    });
    const req2 = httpMock.expectOne(`${service['_apiEndpoint']}/strategy/strat?id=${stratId}`);
    expect(req2.request.method).toEqual('DELETE');
    expect(req2.request.withCredentials).toEqual(true);
    req2.error(new ProgressEvent('Server Error'), { status: 500, statusText: 'Could not delete strategy!' });
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
