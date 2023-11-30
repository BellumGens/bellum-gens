import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApiSearchService } from './bellumgens-api.search.service';
import { CommunicationService } from './communication.service';
import { SearchResult } from '../public_api';


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

  // TODO: Extend each test with req.flush({}) to prevent errors in the console
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

  describe('searchTeams', () => {
    it('should make a GET request to the API endpoint with the provided query', () => {
      const query = 'testQuery';
      service.teamSearchResult.subscribe();
      service.searchTeams(query);
      const req = httpMock.expectOne(`${service['_apiEndpoint']}/search/teams?${query}`);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('searchPlayers', () => {
    it('should make a GET request to the API endpoint with the provided query', () => {
      const query = 'testQuery';
      service.playerSearchResult.subscribe();
      service.searchPlayers(query);
      const req = httpMock.expectOne(`${service['_apiEndpoint']}/search/players?${query}`);
      expect(req.request.method).toBe('GET');
    });
  });

  describe('searchStrategies', () => {
    it('should make a GET request to the API endpoint with the provided query', () => {
      const query = 'testQuery';
      service.strategySearchResult.subscribe();
      service.searchStrategies(query);
      const req = httpMock.expectOne(`${service['_apiEndpoint']}/search/strategies?${query}`);
      expect(req.request.method).toBe('GET');
    });
  });
});
