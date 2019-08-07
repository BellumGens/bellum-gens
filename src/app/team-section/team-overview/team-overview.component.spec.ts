import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamOverviewComponent } from './team-overview.component';
import { IgxAvatarModule,
  IgxIconModule,
  IgxTabsModule,
  IgxInputGroupModule,
  IgxDialogModule} from 'igniteui-angular';
import { TeamApplicationComponent } from '../team-application/team-application.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';

describe('TeamOverviewComponent', () => {
  let component: TeamOverviewComponent;
  let fixture: ComponentFixture<TeamOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule,
        NoopAnimationsModule,
        ServiceWorkerModule.register('', {enabled: false}),
        IgxAvatarModule,
        IgxIconModule,
        IgxTabsModule,
        IgxInputGroupModule,
        IgxDialogModule
      ],
      declarations: [
        TeamOverviewComponent,
        TeamApplicationComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
