import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchComponent } from './search.component';
import { FormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { ApplicationUser, LoginService } from '../../../../../common/src/public_api';
import { environment } from '../../../../../common/src/environments/environment';
import { PlayerSearchComponent } from '../player-search/player-search.component';
import { TeamSearchComponent } from '../team-search/team-search.component';

const mockUser = { id: 'test-id', username: 'TestUser' } as ApplicationUser;

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let httpMock: HttpTestingController;
  const el = (): HTMLElement => fixture.nativeElement;
  const signInNote = 'Signing in gives you access to more search options!';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,

        NoopAnimationsModule,
        ServiceWorkerModule.register('', { enabled: false }),
        SearchComponent
      ],
      providers: [provideRouter([]), provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
    })
    .compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  /** Answers the lazy "who is logged in" check triggered by reading `authUser`. */
  const flushAuthUser = async (user: ApplicationUser) => {
    httpMock.expectOne(environment.authApiEndpoint).flush(user);
    await fixture.whenStable();
  };

  const typeButtons = () => Array.from(el().querySelectorAll<HTMLButtonElement>('igx-buttongroup button'));

  describe('without a logged in user', () => {
    beforeEach(async () => {
      await flushAuthUser(null);
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize searchType as None', () => {
      expect(component.searchType()).toBe(0); // SearchType.None
    });

    it('should initialize authUser as null', () => {
      expect(component.authUser()).toBeNull();
    });

    it('should render the Players and Teams type buttons and no search form', () => {
      expect(typeButtons().map(b => b.textContent.trim())).toEqual(['Players', 'Teams']);
      expect(el().querySelector('app-player-search')).toBeNull();
      expect(el().querySelector('app-team-search')).toBeNull();
    });

    it('should show the sign in note', () => {
      expect(el().textContent).toContain(signInNote);
    });

    it('should show the player search when Players is clicked', async () => {
      typeButtons()[0].click();
      await fixture.whenStable();

      expect(component.searchType()).toBe(1); // SearchType.Player
      expect(el().querySelector('app-player-search')).not.toBeNull();
      expect(el().querySelector('app-team-search')).toBeNull();
    });

    it('should switch to the team search when Teams is clicked', async () => {
      typeButtons()[0].click();
      await fixture.whenStable();
      typeButtons()[1].click();
      await fixture.whenStable();

      expect(component.searchType()).toBe(2); // SearchType.Team
      expect(el().querySelector('app-player-search')).toBeNull();
      expect(el().querySelector('app-team-search')).not.toBeNull();
    });

    it('should pass the missing user down to the rendered search forms', async () => {
      typeButtons()[0].click();
      await fixture.whenStable();
      const playerSearch = fixture.debugElement.query(By.directive(PlayerSearchComponent)).componentInstance as PlayerSearchComponent;
      expect(playerSearch.authUser()).toBeNull();

      typeButtons()[1].click();
      await fixture.whenStable();
      const teamSearch = fixture.debugElement.query(By.directive(TeamSearchComponent)).componentInstance as TeamSearchComponent;
      expect(teamSearch.authUser()).toBeNull();
    });
  });

  describe('with a logged in user', () => {
    beforeEach(async () => {
      await flushAuthUser(mockUser);
    });

    it('should expose the user returned by the account endpoint', () => {
      expect(component.authUser()).toEqual(mockUser);
    });

    it('should hide the sign in note', () => {
      expect(el().textContent).not.toContain(signInNote);
    });

    it('should pass the user down to the team search', async () => {
      typeButtons()[1].click();
      await fixture.whenStable();

      const teamSearch = fixture.debugElement.query(By.directive(TeamSearchComponent)).componentInstance as TeamSearchComponent;
      expect(teamSearch.authUser()).toEqual(mockUser);
    });

    it('should pass the user down to the player search', async () => {
      typeButtons()[0].click();
      await fixture.whenStable();

      const playerSearch = fixture.debugElement.query(By.directive(PlayerSearchComponent)).componentInstance as PlayerSearchComponent;
      expect(playerSearch.authUser()).toEqual(mockUser);
      // A logged in user gets the availability filters, which lazily load the teams they administer.
      expect(el().querySelector('app-player-search #availability')).not.toBeNull();
    });
  });

  it('should react to the user logging in after the view was rendered', async () => {
    await flushAuthUser(null);
    expect(el().textContent).toContain(signInNote);

    TestBed.inject(LoginService)['_applicationUser'].set(mockUser);
    await fixture.whenStable();

    expect(component.authUser()).toEqual(mockUser);
    expect(el().textContent).not.toContain(signInNote);
  });
});
