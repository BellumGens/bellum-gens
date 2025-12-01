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
});
