import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TournamentHomeComponent } from './home.component';
import { FormsModule } from '@angular/forms';
import { IgxIconModule,
  IgxDividerModule,
  IgxInputGroupModule,
  IgxSelectModule,
  IgxDialogModule,
  IgxAvatarModule,
  IgxAutocompleteModule,
  IgxDropDownModule,
  IgxButtonModule,
  IgxListModule,
  IgxProgressBarModule,
  IgxCheckboxModule} from '@infragistics/igniteui-angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BellumGensModule } from 'src-common/lib/public_api';
import { TournamentRegistrationComponent } from '../tournament-registration/tournament-registration.component';
import { StartsWithPipe } from 'src-bellumgens/app/pipes/starts-with.pipe';
import { TeamNewComponent } from 'src-bellumgens/app/team-section/team-new/team-new.component';
import { GetRegCountPipe } from '../pipes/get-reg-count.pipe';

describe('TournamentHomeComponent', () => {
  let component: TournamentHomeComponent;
  let fixture: ComponentFixture<TournamentHomeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        NoopAnimationsModule,
        ServiceWorkerModule.register('', {enabled: false}),
        IgxIconModule,
        IgxDividerModule,
        IgxInputGroupModule,
        IgxSelectModule,
        IgxDialogModule,
        IgxAvatarModule,
        IgxAutocompleteModule,
        IgxDropDownModule,
        IgxButtonModule,
        IgxListModule,
        IgxProgressBarModule,
        IgxCheckboxModule,
        BellumGensModule
      ],
      declarations: [
        TournamentHomeComponent,
        TournamentRegistrationComponent,
        TeamNewComponent,
        GetRegCountPipe,
        StartsWithPipe
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
