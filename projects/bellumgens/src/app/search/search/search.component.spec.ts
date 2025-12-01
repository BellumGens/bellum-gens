import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SearchComponent } from './search.component';
import { IgxButtonGroupModule } from '@infragistics/igniteui-angular/button-group';
import { IgxButtonModule, IgxRippleModule } from '@infragistics/igniteui-angular/directives';
import { IgxRadioModule } from '@infragistics/igniteui-angular/radio';
import { IgxIconModule } from '@infragistics/igniteui-angular/icon';
import { IgxAvatarModule } from '@infragistics/igniteui-angular/avatar';
import { IgxSliderModule } from '@infragistics/igniteui-angular/slider';
import { IgxInputGroupModule } from '@infragistics/igniteui-angular/input-group';
import { IgxSelectModule } from '@infragistics/igniteui-angular/select';
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
