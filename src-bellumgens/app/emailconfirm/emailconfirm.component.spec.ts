import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EmailconfirmComponent } from './emailconfirm.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('EmailconfirmComponent', () => {
  let component: EmailconfirmComponent;
  let fixture: ComponentFixture<EmailconfirmComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ RouterTestingModule ],
      declarations: [ EmailconfirmComponent ]
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
