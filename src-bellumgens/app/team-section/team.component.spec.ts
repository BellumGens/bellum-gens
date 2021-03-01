import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { IgxAvatarModule,
  IgxIconModule,
  IgxTabsModule,
  IgxInputGroupModule,
  IgxDialogModule} from '@infragistics/igniteui-angular';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { TeamComponent } from './team.component';
import { TeamApplicationComponent } from './team-application/team-application.component';

describe('TeamComponent', () => {
  let component: TeamComponent;
  let fixture: ComponentFixture<TeamComponent>;

  beforeEach(waitForAsync(() => {
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
        TeamComponent,
        TeamApplicationComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
