import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RegistrationSuccessComponent } from './registration-success.component';
import { provideRouter } from '@angular/router';

describe('RegistrationSuccessComponent', () => {
  let component: RegistrationSuccessComponent;
  let fixture: ComponentFixture<RegistrationSuccessComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [
        RegistrationSuccessComponent
        ],
    providers: [provideRouter([])]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
