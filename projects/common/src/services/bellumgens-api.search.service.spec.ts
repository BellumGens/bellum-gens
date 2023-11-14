import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ApiSearchService } from './bellumgens-api.search.service';


describe('ApiSearchService', () => {
  let service: ApiSearchService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ ApiSearchService ]
    });
    service = TestBed.inject(ApiSearchService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // TODO: Extend each test with req.flush({}) to prevent errors in the console
  describe('quickSearch', () => {
    it('should make a GET request to the API endpoint with the provided name', () => {
      const name = 'testName';
      service.searchResult.subscribe();
      service.quickSearch(name);
      const req = httpMock.expectOne(`${service['_apiEndpoint']}/search?name=${name}`);
      expect(req.request.method).toBe('GET');
    });
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
