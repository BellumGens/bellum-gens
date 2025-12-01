import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NotificationsComponent } from './notifications.component';
import { IgxCircularProgressBarComponent, IGX_LIST_DIRECTIVES, IgxAvatarComponent } from '@infragistics/igniteui-angular';
import { DisabledNotificationsPipe } from '../pipes/disabled-notifications.pipe';
import { SortNotificationsPipe } from '../pipes/sort-notifications.pipe';
import { RouterTestingModule } from '@angular/router/testing';
import { SortApplicationsPipe } from '../pipes/sort-applications.pipe';
import { NotificationStatePipe } from '../pipes/notification-state.pipe';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { PlayerNotificationsComponent } from './player-notifications/player-notifications.component';
import { TeamNotificationsComponent } from './team-notifications/team-notifications.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('NotificationsComponent', () => {
  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [RouterTestingModule,
        ServiceWorkerModule.register('', { enabled: false }),
        IgxCircularProgressBarComponent,
        IGX_LIST_DIRECTIVES,
        IgxAvatarComponent,
        NotificationsComponent,
        PlayerNotificationsComponent,
        TeamNotificationsComponent,
        DisabledNotificationsPipe,
        SortNotificationsPipe,
        SortApplicationsPipe,
        NotificationStatePipe],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
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

  it('should initialize teamAdmin observable', () => {
    expect(component.teamAdmin).toBeDefined();
  });

  it('should emit loaded event when aggregate is called with unread notifications', (done) => {
    const unreadCount = 5;
    const mockNotifications = [
      { read: false },
      { read: false },
      { read: false },
      { read: false },
      { read: false }
    ];

    component.loaded.subscribe((count) => {
      expect(count).toBeGreaterThan(0);
      done();
    });

    component.aggregate(mockNotifications);
  });

  it('should not emit loaded event when aggregate is called with all read notifications', () => {
    const mockNotifications = [
      { read: true },
      { read: true }
    ];

    spyOn(component.loaded, 'emit');
    component.aggregate(mockNotifications);

    expect(component.loaded.emit).not.toHaveBeenCalled();
  });

  it('should emit loaded event when changed is called', (done) => {
    const testCount = 3;

    component.loaded.subscribe((count) => {
      expect(count).toBe(testCount);
      done();
    });

    component.changed(testCount);
  });

  it('should subscribe to auth user changes', () => {
    expect(component.teamAdmin).toBeDefined();
  });
});
