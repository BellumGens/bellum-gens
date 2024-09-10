import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TeamSearchComponent } from './team-search.component';
import { FormsModule } from '@angular/forms';
import { IgxRadioModule,
  IgxSliderModule,
  IgxRippleModule,
  IgxAvatarModule,
  IgxIconModule,
  IgxInputGroupModule,
  IgxButtonModule} from '@infragistics/igniteui-angular';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('TeamSearchComponent', () => {
  let component: TeamSearchComponent;
  let fixture: ComponentFixture<TeamSearchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [FormsModule,
        RouterTestingModule,
        NoopAnimationsModule,
        ServiceWorkerModule.register('', { enabled: false }),
        IgxRadioModule,
        IgxSliderModule,
        IgxRippleModule,
        IgxAvatarModule,
        IgxIconModule,
        IgxInputGroupModule,
        IgxButtonModule,
        TeamSearchComponent],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
