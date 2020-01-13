import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentRegistrationComponent } from './tournament-registration.component';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
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
  IgxCheckboxModule } from 'igniteui-angular';
import { StartsWithPipe } from 'src-bellumgens/app/pipes/starts-with.pipe';
import { TeamNewComponent } from 'src-bellumgens/app/team-section/team-new/team-new.component';
import { GroupsFilterPipe } from 'src-bellumgens/app/pipes/groups-filter.pipe';

describe('TournamentRegistrationComponent', () => {
  let component: TournamentRegistrationComponent;
  let fixture: ComponentFixture<TournamentRegistrationComponent>;

  beforeEach(async(() => {
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
        IgxCheckboxModule
      ],
      declarations: [
        TournamentRegistrationComponent,
        TeamNewComponent,
        GroupsFilterPipe,
        StartsWithPipe
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
