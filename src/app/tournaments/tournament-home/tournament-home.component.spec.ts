import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentHomeComponent } from './tournament-home.component';
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
  IgxProgressBarModule} from 'igniteui-angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { LoginDialogComponent } from 'src/app/login/login-dialog/login-dialog.component';
import { TeamNewComponent } from 'src/app/team-section/team-new/team-new.component';
import { StartsWithPipe } from 'src/app/pipes/starts-with.pipe';
import { GroupsFilterPipe } from 'src/app/pipes/groups-filter.pipe';

describe('TournamentHomeComponent', () => {
  let component: TournamentHomeComponent;
  let fixture: ComponentFixture<TournamentHomeComponent>;

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
        IgxProgressBarModule
      ],
      declarations: [
        TournamentHomeComponent,
        LoginDialogComponent,
        TeamNewComponent,
        StartsWithPipe,
        GroupsFilterPipe
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
