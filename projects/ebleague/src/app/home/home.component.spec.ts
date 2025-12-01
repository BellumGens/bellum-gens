import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { FormsModule } from '@angular/forms';
import { IgxIconComponent, IgxButtonDirective, IgxDividerDirective, IGX_INPUT_GROUP_DIRECTIVES, IGX_SELECT_DIRECTIVES, IGX_DIALOG_DIRECTIVES, IgxAvatarComponent, IGX_DROP_DOWN_DIRECTIVES, IGX_LIST_DIRECTIVES, IgxCircularProgressBarComponent, IgxCheckboxComponent } from '@infragistics/igniteui-angular';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TournamentRegistrationComponent } from '../tournament-registration/tournament-registration.component';
import { StartsWithPipe } from '../../../../common/src/lib/pipes/starts-with.pipe';
import { TeamNewComponent } from 'projects/bellumgens/src/app/team-section/team-new/team-new.component';
import { GetRegCountPipe } from '../pipes/get-reg-count.pipe';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('TournamentHomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [FormsModule,
        RouterTestingModule,
        NoopAnimationsModule,
        ServiceWorkerModule.register('', { enabled: false }),
        IgxIconComponent,
        IgxDividerDirective,
        IGX_INPUT_GROUP_DIRECTIVES,
        IGX_SELECT_DIRECTIVES,
        IGX_DIALOG_DIRECTIVES,
        IgxAvatarComponent,
        IGX_DROP_DOWN_DIRECTIVES,
        IgxButtonDirective,
        IGX_LIST_DIRECTIVES,
        IgxCircularProgressBarComponent,
        IgxCheckboxComponent,
        HomeComponent,
        TournamentRegistrationComponent,
        TeamNewComponent,
        GetRegCountPipe,
        StartsWithPipe],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
