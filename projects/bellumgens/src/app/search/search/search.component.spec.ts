import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SearchComponent } from './search.component';
import { IgxButtonGroupModule,
  IgxRippleModule,
  IgxRadioModule,
  IgxIconModule,
  IgxAvatarModule,
  IgxSliderModule,
  IgxInputGroupModule,
  IgxButtonModule,
  IgxSelectModule} from '@infragistics/igniteui-angular';
import { PlayerSearchComponent } from '../player-search/player-search.component';
import { TeamSearchComponent } from '../team-search/team-search.component';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [FormsModule,
        RouterTestingModule,
        NoopAnimationsModule,
        ServiceWorkerModule.register('', { enabled: false }),
        IgxButtonGroupModule,
        IgxRippleModule,
        IgxRadioModule,
        IgxIconModule,
        IgxAvatarModule,
        IgxSliderModule,
        IgxRippleModule,
        IgxInputGroupModule,
        IgxButtonModule,
        IgxSelectModule,
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
});
