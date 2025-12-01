import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PlayerNotificationsComponent } from './player-notifications.component';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('NotificationsComponent', () => {
  let component: PlayerNotificationsComponent;
  let fixture: ComponentFixture<PlayerNotificationsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [RouterTestingModule,
        ServiceWorkerModule.register('', { enabled: false }),
        PlayerNotificationsComponent],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
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
