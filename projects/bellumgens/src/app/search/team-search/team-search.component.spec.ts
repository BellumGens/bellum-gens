import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TeamSearchComponent } from './team-search.component';
import { FormsModule } from '@angular/forms';
import { IGX_RADIO_GROUP_DIRECTIVES, IGX_SLIDER_DIRECTIVES, IgxButtonDirective, IgxRippleDirective, IgxAvatarComponent, IgxIconComponent, IGX_INPUT_GROUP_DIRECTIVES } from '@infragistics/igniteui-angular';
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
        IGX_RADIO_GROUP_DIRECTIVES,
        IGX_SLIDER_DIRECTIVES,
        IgxRippleDirective,
        IgxAvatarComponent,
        IgxIconComponent,
        IGX_INPUT_GROUP_DIRECTIVES,
        IgxButtonDirective,
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
