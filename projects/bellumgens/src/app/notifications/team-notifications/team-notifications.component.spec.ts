import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TeamNotificationsComponent } from './team-notifications.component';
import { RouterTestingModule } from '@angular/router/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('TeamNotificationsComponent', () => {
  let component: TeamNotificationsComponent;
  let fixture: ComponentFixture<TeamNotificationsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [RouterTestingModule,
        TeamNotificationsComponent],
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
