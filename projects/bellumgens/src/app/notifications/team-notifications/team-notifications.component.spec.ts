import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TeamNotificationsComponent } from './team-notifications.component';
import { IGX_LIST_DIRECTIVES, IgxAvatarComponent } from '@infragistics/igniteui-angular';
import { SortApplicationsPipe } from 'projects/bellumgens/src/app/pipes/sort-applications.pipe';
import { DisabledNotificationsPipe } from 'projects/bellumgens/src/app/pipes/disabled-notifications.pipe';
import { RouterTestingModule } from '@angular/router/testing';
import { NotificationStatePipe } from 'projects/bellumgens/src/app/pipes/notification-state.pipe';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('TeamNotificationsComponent', () => {
  let component: TeamNotificationsComponent;
  let fixture: ComponentFixture<TeamNotificationsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [RouterTestingModule,
        IGX_LIST_DIRECTIVES,
        IgxAvatarComponent,
        TeamNotificationsComponent,
        SortApplicationsPipe,
        DisabledNotificationsPipe,
        NotificationStatePipe],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();
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
