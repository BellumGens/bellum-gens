import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickSearchComponent } from './quick-search.component';
import { provideRouter } from '@angular/router';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { ApiSearchService } from 'bellum-gens-common';

describe('QuickSearchComponent', () => {
  let component: QuickSearchComponent;
  let fixture: ComponentFixture<QuickSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
        imports: [
          
          QuickSearchComponent
        ],
        providers: [provideRouter([]), provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty search result', () => {
    expect(component.searchResult()).toEqual({ steamUser: null, players: [], teams: [], strategies: [] });
  });

  it('should initialize loading as false', () => {
    expect(component.loading()).toBe(false);
  });

  it('should initialize term as empty string', () => {
    expect(component.term()).toBe('');
  });

  it('should update searchResult when apiService emits new data', () => {
    const apiService = TestBed.inject(ApiSearchService) as ApiSearchService;
    const mockResult = {
      steamUser: null,
      players: [{
        id: '1',
        customUrl: 'player1',
        username: 'player1',
        csgoDetails: {
          country: 'US',
          avatarIcon: '',
          realName: 'Player 1',
          killDeathRatio: 1.5,
          headshotPercentage: 45
        },
        steamPrivate: false
      }],
      teams: [],
      strategies: []
    };

    apiService['_searchResult'].set(mockResult as any);
    fixture.detectChanges();

    expect(component.searchResult().players.length).toBe(1);
  });

  it('should update loading state when apiService emits loading status', () => {
    const apiService = TestBed.inject(ApiSearchService) as ApiSearchService;

    apiService['_loadingQuickSearch'].set(true);
    fixture.detectChanges();

    expect(component.loading()).toBe(true);

    apiService['_loadingQuickSearch'].set(false);
    fixture.detectChanges();

    expect(component.loading()).toBe(false);
  });

  it('should update term when apiService emits search term', () => {
    const apiService = TestBed.inject(ApiSearchService) as ApiSearchService;
    const testTerm = 'test search';

    apiService['_searchTerm'].set(testTerm);
    fixture.detectChanges();

    expect(component.term()).toBe(testTerm);
  });
});
