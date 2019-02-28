import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamNotificationsComponent } from './team-notifications.component';
import { IgxListModule, IgxAvatarModule } from 'igniteui-angular';
import { SortApplicationsPipe } from 'src/app/pipes/sort-applications.pipe';
import { DisabledNotificationsPipe } from 'src/app/pipes/disabled-notifications.pipe';
import { RouterTestingModule } from '@angular/router/testing';

describe('TeamNotificationsComponent', () => {
  let component: TeamNotificationsComponent;
  let fixture: ComponentFixture<TeamNotificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        IgxListModule,
        IgxAvatarModule
      ],
      declarations: [
        TeamNotificationsComponent,
        SortApplicationsPipe,
        DisabledNotificationsPipe
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
