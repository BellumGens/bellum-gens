import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamNewComponent } from './team-new.component';
import { IgxIconModule,
  IgxInputGroupModule,
  IgxDialogModule,
  IgxAvatarModule,
  IgxListModule,
  IgxProgressBarModule } from 'igniteui-angular';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { GroupsFilterPipe } from 'src-bellumgens/app/pipes/groups-filter.pipe';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TeamNewComponent', () => {
  let component: TeamNewComponent;
  let fixture: ComponentFixture<TeamNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TeamNewComponent,
        GroupsFilterPipe
      ],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        NoopAnimationsModule,
        IgxIconModule,
        IgxInputGroupModule,
        IgxDialogModule,
        IgxAvatarModule,
        IgxListModule,
        IgxProgressBarModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
