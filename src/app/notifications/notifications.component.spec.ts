import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsComponent } from './notifications.component';
import { PlayerNotificationsComponent } from '../player-section/notifications/notifications.component';
import { TeamNotificationsComponent } from '../team-section/team-notifications/team-notifications.component';
import { IgxProgressBarModule, IgxListModule, IgxAvatarModule } from 'igniteui-angular';
import { DisabledNotificationsPipe } from '../pipes/disabled-notifications.pipe';
import { SortNotificationsPipe } from '../pipes/sort-notifications.pipe';
import { RouterTestingModule } from '@angular/router/testing';
import { SortApplicationsPipe } from '../pipes/sort-applications.pipe';
import { NotificationStatePipe } from '../pipes/notification-state.pipe';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('NotificationsComponent', () => {
  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        IgxProgressBarModule,
        IgxListModule,
        IgxAvatarModule
      ],
      declarations: [
        NotificationsComponent,
        PlayerNotificationsComponent,
        TeamNotificationsComponent,
        DisabledNotificationsPipe,
        SortNotificationsPipe,
        SortApplicationsPipe,
        NotificationStatePipe
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
