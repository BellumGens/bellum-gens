import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmailconfirmComponent } from './emailconfirm.component';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('EmailconfirmComponent', () => {
  let component: EmailconfirmComponent;
  let fixture: ComponentFixture<EmailconfirmComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [EmailconfirmComponent],
    providers: [
      provideRouter([]),
      {
        provide: ActivatedRoute,
        useValue: {
          params: of({}),
          data: of({})
        }
      }
    ]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailconfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
