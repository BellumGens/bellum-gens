import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamNavComponent } from './team-nav.component';
import { IgxAvatarModule,
  IgxCardModule,
  IgxListModule,
  IgxInputGroupModule,
  IgxIconModule,
  IgxDialogModule,
  IgxProgressBarModule } from 'igniteui-angular';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { GroupsFilterPipe } from 'src-bellumgens/app/pipes/groups-filter.pipe';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TeamNewComponent } from '../team-new/team-new.component';
import { BellumGensModule } from 'src-common/components/components.module';
import { ServiceWorkerModule } from '@angular/service-worker';

describe('TeamNavComponent', () => {
  let component: TeamNavComponent;
  let fixture: ComponentFixture<TeamNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterTestingModule,
        NoopAnimationsModule,
        HttpClientTestingModule,
        ServiceWorkerModule.register('', {enabled: false}),
        IgxIconModule,
        IgxAvatarModule,
        IgxCardModule,
        IgxListModule,
        IgxInputGroupModule,
        IgxDialogModule,
        IgxProgressBarModule,
        BellumGensModule
      ],
      declarations: [
        TeamNavComponent,
        GroupsFilterPipe,
        TeamNewComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
