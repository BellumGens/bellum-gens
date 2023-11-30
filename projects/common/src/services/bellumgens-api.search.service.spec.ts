import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApiSearchService } from './bellumgens-api.search.service';
import { CommunicationService } from './communication.service';
import { CSGOMap, CSGOPlayer, CSGOTeam, SearchResult, Side } from '../public_api';


describe('ApiSearchService', () => {
  let service: ApiSearchService;
  let httpMock: HttpTestingController;
  let commService: CommunicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ ApiSearchService ]
    });
    service = TestBed.inject(ApiSearchService);
    commService = TestBed.inject(CommunicationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make a GET request to the API endpoint with the provided name', () => {
    let name = 'testName';
    const result: SearchResult = {
      players: [],
      strategies: [],
      teams: [],
      steamUser: null
    };
    service.quickSearch(name);
    expect(service.loadingQuickSearch.value).toBeTruthy();
    const req = httpMock.expectOne(`${service['_apiEndpoint']}/search?name=${name}`);
    expect(req.request.method).toBe('GET');
    req.flush(result);
    expect(service.searchResult.value).toEqual(result);
    expect(service.loadingQuickSearch.value).toBeFalsy();
    expect(service['_searchResultCache'].get(name)).toEqual(result);

    name = 'test';
    const errorMessage = `Http failure response for ${service['_apiEndpoint']}/search?name=${name}: 500 Could not retrieve search results!`;
    commService.error.subscribe(message => expect(message).toEqual(errorMessage));
    service.quickSearch(name);
    const req2 = httpMock.expectOne(`${service['_apiEndpoint']}/search?name=${name}`);
    expect(req2.request.method).toBe('GET');
    req2.error(new ProgressEvent('Server Error'), { status: 500, statusText: 'Could not retrieve search results!' });
  });

  it('searchTeams should make a GET request to the API endpoint with the provided query', () => {
    let query = 'role=1&overlap=1';
    const teams: CSGOTeam[] = [
      { teamName: 'testTeam', teamId: '1', teamAvatar: 'testLogo', visible: true, description: 'testDescription'},
      { teamName: 'testTeam2', teamId: '2', teamAvatar: 'testLogo2', visible: true, description: 'testDescription2'}
    ];
    service.searchTeams(query);
    const req = httpMock.expectOne(`${service['_apiEndpoint']}/search/teams?${query}`);
    expect(req.request.method).toBe('GET');
    expect(service.loadingSearch.value).toBeTruthy();
    expect(service.teamSearchResult.value).toEqual([]);
    req.flush(teams);
    expect(service.loadingSearch.value).toBeFalsy();
    expect(service.teamSearchResult.value).toEqual(teams);
    expect(service['_teamSearchCache'].get(query)).toEqual(teams);

    query = 'role=2&overlap=1';
    const errorMessage = `Http failure response for ${service['_apiEndpoint']}/search/teams?${query}: 500 Could not retrieve search results!`;
    commService.error.subscribe(message => expect(message).toEqual(errorMessage));
    service.searchTeams(query);
    const req2 = httpMock.expectOne(`${service['_apiEndpoint']}/search/teams?${query}`);
    expect(req2.request.method).toBe('GET');
    req2.error(new ProgressEvent('Server Error'), { status: 500, statusText: 'Could not retrieve search results!' });

    // Should return teams from the quick search result cache if the query starts with 'name'
    query = 'name=test';
    const result: SearchResult = {
      players: [],
      strategies: [],
      teams: [
        { teamName: 'test', teamId: '1', teamAvatar: 'testLogo', visible: true, description: 'testDescription'}
      ],
      steamUser: null
    };
    service.quickSearch('test');
    const req3 = httpMock.expectOne(`${service['_apiEndpoint']}/search?name=test`);
    expect(req3.request.method).toBe('GET');
    req3.flush(result);
    service.searchTeams(query);
    expect(service.teamSearchResult.value).toEqual(result.teams);
  });

  it('searchPlayers should make a GET request to the API endpoint with the provided query', () => {
    let query = 'role=1&overlap=1';
    const players: CSGOPlayer [] = [
      {
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
      }
    ];
    service.searchPlayers(query);
    const req = httpMock.expectOne(`${service['_apiEndpoint']}/search/players?${query}`);
    expect(req.request.method).toBe('GET');
    expect(service.loadingSearch.value).toBeTruthy();
    req.flush(players);
    expect(service.loadingSearch.value).toBeFalsy();
    expect(service.playerSearchResult.value).toEqual(players);
    expect(service['_playerSearchCache'].get(query)).toEqual(players);

    query = 'role=2&overlap=1';
    const errorMessage = `Http failure response for ${service['_apiEndpoint']}/search/players?${query}: 500 Could not retrieve search results!`;
    commService.error.subscribe(message => expect(message).toEqual(errorMessage));
    service.searchPlayers(query);
    const req2 = httpMock.expectOne(`${service['_apiEndpoint']}/search/players?${query}`);
    expect(req2.request.method).toBe('GET');
    req2.error(new ProgressEvent('Server Error'), { status: 500, statusText: 'Could not retrieve search results!' });

    query = 'name=test';
    const result: SearchResult = {
      players: players,
      strategies: [],
      teams: [
        { teamName: 'test', teamId: '1', teamAvatar: 'testLogo', visible: true, description: 'testDescription'}
      ],
      steamUser: null
    };
    service.quickSearch('test');
    const req3 = httpMock.expectOne(`${service['_apiEndpoint']}/search?name=test`);
    expect(req3.request.method).toBe('GET');
    req3.flush(result);
    service.searchPlayers(query);
    expect(service.playerSearchResult.value).toEqual(result.players);
  });

  it('searchStrategies should make a GET request to the API endpoint with the provided query', () => {
    let query = 'testQuery';
    service.searchStrategies(query);
    const req = httpMock.expectOne(`${service['_apiEndpoint']}/search/strategies?${query}`);
    expect(req.request.method).toBe('GET');
    expect(service.loadingSearch.value).toBeTruthy();
    req.flush([]);
    expect(service.loadingSearch.value).toBeFalsy();
    expect(service.strategySearchResult.value).toEqual([]);
    expect(service['_strategySearchCache'].get(query)).toEqual([]);

    query = 'testQuery2';
    const errorMessage = `Http failure response for ${service['_apiEndpoint']}/search/strategies?${query}: 500 Could not retrieve search results!`;
    commService.error.subscribe(message => expect(message).toEqual(errorMessage));
    service.searchStrategies(query);
    const req2 = httpMock.expectOne(`${service['_apiEndpoint']}/search/strategies?${query}`);
    expect(req2.request.method).toBe('GET');
    req2.error(new ProgressEvent('Server Error'), { status: 500, statusText: 'Could not retrieve search results!' });

    // Should return strategies from the quick search result cache if the query starts with 'name'
    query = 'name=test';
    const result: SearchResult = {
      players: [],
      strategies: [
        {
          id: '123456',
          title: 'Test 1',
          description: 'Test 2',
          map: CSGOMap.Dust2,
          side: Side.TSide,
          teamId: '123',
          url: 'test.com'
        }
      ],
      teams: [],
      steamUser: null
    };
    service.quickSearch('test');
    const req3 = httpMock.expectOne(`${service['_apiEndpoint']}/search?name=test`);
    expect(req3.request.method).toBe('GET');
    req3.flush(result);
    service.searchStrategies(query);
    expect(service.strategySearchResult.value).toEqual(result.strategies);
  });
});
