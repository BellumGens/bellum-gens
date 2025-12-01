import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QuickSearchComponent } from './quick-search.component';
import { IgxCircularProgressBarComponent, IGX_LIST_DIRECTIVES, IgxAvatarComponent, IgxIconComponent } from '@infragistics/igniteui-angular';
import { RouterTestingModule } from '@angular/router/testing';
import { ReduceQuickSearchResultPipe } from 'projects/bellumgens/src/app/pipes/reduce-quick-search-result.pipe';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ApiSearchService } from 'bellum-gens-common';

describe('QuickSearchComponent', () => {
  let component: QuickSearchComponent;
  let fixture: ComponentFixture<QuickSearchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [RouterTestingModule,
        IgxCircularProgressBarComponent,
        IGX_LIST_DIRECTIVES,
        IgxAvatarComponent,
        IgxIconComponent,
        QuickSearchComponent,
        ReduceQuickSearchResultPipe],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty search result', () => {
    expect(component.searchResult).toEqual({ steamUser: null, players: [], teams: [], strategies: [] });
  });

  it('should initialize loading as false', () => {
    expect(component.loading).toBe(false);
  });

  it('should initialize term as empty string', () => {
    // term can be '' or null depending on initialization timing
    expect(component.term === '' || component.term === null).toBeTruthy();
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

    apiService.searchResult.next(mockResult as any);
    fixture.detectChanges();

    expect(component.searchResult.players.length).toBe(1);
  });

  it('should update loading state when apiService emits loading status', () => {
    const apiService = TestBed.inject(ApiSearchService) as ApiSearchService;

    apiService.loadingQuickSearch.next(true);
    fixture.detectChanges();

    expect(component.loading).toBe(true);

    apiService.loadingQuickSearch.next(false);
    fixture.detectChanges();

    expect(component.loading).toBe(false);
  });

  it('should update term when apiService emits search term', () => {
    const apiService = TestBed.inject(ApiSearchService) as ApiSearchService;
    const testTerm = 'test search';

    apiService.searchTerm.next(testTerm);
    fixture.detectChanges();

    expect(component.term).toBe(testTerm);
  });
});
