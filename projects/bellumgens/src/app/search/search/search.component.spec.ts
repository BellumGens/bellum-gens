import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SearchComponent } from './search.component';
import { IgxButtonGroupComponent, IgxButtonDirective, IgxRippleDirective, IGX_RADIO_GROUP_DIRECTIVES, IgxIconComponent, IgxAvatarComponent, IGX_SLIDER_DIRECTIVES, IGX_INPUT_GROUP_DIRECTIVES, IGX_SELECT_DIRECTIVES } from '@infragistics/igniteui-angular';
import { PlayerSearchComponent } from '../player-search/player-search.component';
import { TeamSearchComponent } from '../team-search/team-search.component';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { LoginService } from 'bellum-gens-common';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [FormsModule,
        RouterTestingModule,
        NoopAnimationsModule,
        ServiceWorkerModule.register('', { enabled: false }),
        IgxButtonGroupComponent,
        IgxRippleDirective,
        IGX_RADIO_GROUP_DIRECTIVES,
        IgxIconComponent,
        IgxAvatarComponent,
        IGX_SLIDER_DIRECTIVES,
        IGX_INPUT_GROUP_DIRECTIVES,
        IgxButtonDirective,
        IGX_SELECT_DIRECTIVES,
        SearchComponent,
        PlayerSearchComponent,
        TeamSearchComponent],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize searchType as None', () => {
    expect(component.searchType).toBe(0); // SearchType.None
  });

  it('should initialize authUser as undefined', () => {
    // authUser is null until subscription updates it
    expect(component.authUser).toBeNull();
  });

  it('should subscribe to auth user changes', () => {
    const authService = TestBed.inject(LoginService);
    const mockUser = {
      id: 'test-id',
      username: 'TestUser'
    };

    authService.applicationUser.next(mockUser as any);
    fixture.detectChanges();

    expect(component.authUser).toBeDefined();
  });

  it('should change searchType when button is clicked', () => {
    component.searchType = 1; // SearchType.Player
    expect(component.searchType).toBe(1);

    component.searchType = 2; // SearchType.Team
    expect(component.searchType).toBe(2);
  });

  it('should have PlayerSearchComponent and TeamSearchComponent as children', () => {
    const compiled = fixture.nativeElement;
    expect(compiled).toBeTruthy();
  });
});
