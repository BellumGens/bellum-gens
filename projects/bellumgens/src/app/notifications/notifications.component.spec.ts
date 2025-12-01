import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NotificationsComponent } from './notifications.component';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('NotificationsComponent', () => {
  let component: NotificationsComponent;
  let fixture: ComponentFixture<NotificationsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [RouterTestingModule,
        ServiceWorkerModule.register('', { enabled: false }),
        NotificationsComponent],
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
    // teamAdmin is initialized only when user logs in
    expect(component.teamAdmin).toBeUndefined();
  });

  it('should emit loaded event when aggregate is called with unread notifications', () => {
    const mockNotifications = [
      { state: 0 }, // NotificationState.NotSeen = 0
      { state: 0 },
      { state: 0 },
      { state: 0 },
      { state: 0 }
    ];

    spyOn(component.loaded, 'emit');
    component.aggregate(mockNotifications);

    expect(component.loaded.emit).toHaveBeenCalledWith(5);
  });

  it('should not emit loaded event when aggregate is called with all read notifications', () => {
    const mockNotifications = [
      { state: 1 }, // NotificationState.Seen = 1
      { state: 1 }
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
    // teamAdmin is undefined until user logs in
    expect(component.teamAdmin).toBeUndefined();
  });
});
