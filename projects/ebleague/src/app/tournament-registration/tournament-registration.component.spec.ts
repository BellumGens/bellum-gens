import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TournamentRegistrationComponent } from './tournament-registration.component';
import { FormsModule } from '@angular/forms';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('TournamentRegistrationComponent', () => {
  let component: TournamentRegistrationComponent;
  let fixture: ComponentFixture<TournamentRegistrationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [FormsModule,
        NoopAnimationsModule,
        ServiceWorkerModule.register('', { enabled: false }),
        TournamentRegistrationComponent],
    providers: [
      provideHttpClient(withInterceptorsFromDi()),
      provideHttpClientTesting(),
      provideRouter([])
    ]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
