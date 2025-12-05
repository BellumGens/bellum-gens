import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PlayerNotificationsComponent } from './player-notifications.component';
import { provideRouter } from '@angular/router';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('NotificationsComponent', () => {
  let component: PlayerNotificationsComponent;
  let fixture: ComponentFixture<PlayerNotificationsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [
        ServiceWorkerModule.register('', { enabled: false }),
        PlayerNotificationsComponent],
    providers: [provideRouter([]), provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
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
