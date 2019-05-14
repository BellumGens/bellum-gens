import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamNavComponent } from './team-nav.component';
import { IgxAvatarModule, IgxCardModule, IgxListModule, IgxInputGroupModule, IgxIconModule, IgxDialogModule } from 'igniteui-angular';
import { FormsModule } from '@angular/forms';
import { ConfirmComponent } from 'src/app/confirm/confirm.component';
import { RouterTestingModule } from '@angular/router/testing';
import { GroupsFilterPipe } from 'src/app/pipes/groups-filter.pipe';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';

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
        IgxIconModule,
        IgxAvatarModule,
        IgxCardModule,
        IgxListModule,
        IgxInputGroupModule,
        IgxDialogModule
      ],
      declarations: [
        TeamNavComponent,
        ConfirmComponent,
        GroupsFilterPipe
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
