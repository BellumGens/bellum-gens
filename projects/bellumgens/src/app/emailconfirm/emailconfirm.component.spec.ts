import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailconfirmComponent } from './emailconfirm.component';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

describe('EmailconfirmComponent', () => {
  let component: EmailconfirmComponent;
  let fixture: ComponentFixture<EmailconfirmComponent>;
  let params: BehaviorSubject<Record<string, string>>;

  const heading = (): HTMLHeadingElement => fixture.nativeElement.querySelector('h2');

  beforeEach(async () => {
    params = new BehaviorSubject<Record<string, string>>({});
    await TestBed.configureTestingModule({
      imports: [EmailconfirmComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            params,
            data: new BehaviorSubject({})
          }
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailconfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.message()).toBe('Email confirmed successfully!');
  });

  it('should render the success message when there is no error parameter', () => {
    expect(heading().textContent.trim()).toBe('Email confirmed successfully!');
    expect(heading().classList).toContain('color-success');
  });

  it('should render the error message when the confirmation failed', async () => {
    params.next({ error: 'error' });
    await fixture.whenStable();

    expect(component.message()).toBe(':( Error confirming your email address!');
    expect(heading().textContent.trim()).toBe(':( Error confirming your email address!');
  });

  it('should render the unsubscribe message when the user unsubscribed', async () => {
    params.next({ error: 'unsubscribed' });
    await fixture.whenStable();

    expect(component.message()).toBe('You\'ve been unsubscribed successfully!');
    expect(heading().textContent.trim()).toBe('You\'ve been unsubscribed successfully!');
  });

  it('should fall back to the success message for an unknown error value', async () => {
    params.next({ error: 'error' });
    await fixture.whenStable();
    params.next({ error: 'something-else' });
    await fixture.whenStable();

    expect(heading().textContent.trim()).toBe('Email confirmed successfully!');
  });
});
