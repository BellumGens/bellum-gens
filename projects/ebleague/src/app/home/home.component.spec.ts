import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { FormsModule } from '@angular/forms';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
import { IgxButtonDirective, IgxDividerDirective } from '@infragistics/igniteui-angular/directives';
import { IGX_INPUT_GROUP_DIRECTIVES } from '@infragistics/igniteui-angular/input-group';
import { IGX_SELECT_DIRECTIVES } from '@infragistics/igniteui-angular/select';
import { IGX_DIALOG_DIRECTIVES } from '@infragistics/igniteui-angular/dialog';
import { IgxAvatarComponent } from '@infragistics/igniteui-angular/avatar';
import { IGX_DROP_DOWN_DIRECTIVES } from '@infragistics/igniteui-angular/drop-down';
import { IGX_LIST_DIRECTIVES } from '@infragistics/igniteui-angular/list';
import { IgxCircularProgressBarComponent } from '@infragistics/igniteui-angular/progressbar';
import { IgxCheckboxComponent } from '@infragistics/igniteui-angular/checkbox';
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
      imports: [
        RouterTestingModule,
        NoopAnimationsModule,
        ServiceWorkerModule.register('', { enabled: false }),
        HomeComponent
      ],
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
