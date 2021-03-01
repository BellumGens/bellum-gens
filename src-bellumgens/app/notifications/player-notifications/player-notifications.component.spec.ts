import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PlayerNotificationsComponent } from './player-notifications.component';
import { IgxListModule, IgxAvatarModule } from '@infragistics/igniteui-angular';
import { DisabledNotificationsPipe } from 'src-bellumgens/app/pipes/disabled-notifications.pipe';
import { RouterTestingModule } from '@angular/router/testing';
import { SortNotificationsPipe } from 'src-bellumgens/app/pipes/sort-notifications.pipe';
import { NotificationStatePipe } from 'src-bellumgens/app/pipes/notification-state.pipe';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';

describe('NotificationsComponent', () => {
  let component: PlayerNotificationsComponent;
  let fixture: ComponentFixture<PlayerNotificationsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        ServiceWorkerModule.register('', {enabled: false}),
        IgxListModule,
        IgxAvatarModule
      ],
      declarations: [
        PlayerNotificationsComponent,
        DisabledNotificationsPipe,
        SortNotificationsPipe,
        NotificationStatePipe
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
