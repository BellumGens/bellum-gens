import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SuccessErrorComponent } from './success-error.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { CommunicationService } from 'bellum-gens-common';

describe('SuccessErrorComponent', () => {
  let component: SuccessErrorComponent;
  let fixture: ComponentFixture<SuccessErrorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        SuccessErrorComponent
      ],
      providers: [provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default success and error messages', () => {
    expect(component.successMsg).toBe('Success...');
    expect(component.errorMsg).toBe('Error has occurred...');
  });

  it('should have default icon and class for success', () => {
    expect(component.icon).toBe('done');
    expect(component.class).toBe('color-success');
  });

  it('should show success message', () => {
    vi.spyOn(component.message, 'open').mockImplementation(() => undefined);
    const testMessage = 'Operation successful';

    component.showMessage('success', testMessage);

    expect(component.notificationMsg).toBe(testMessage);
    expect(component.icon).toBe('done');
    expect(component.class).toBe('color-success');
    expect(component.message.open).toHaveBeenCalled();
  });

  it('should show error message', () => {
    vi.spyOn(component.message, 'open').mockImplementation(() => undefined);
    const testMessage = 'Operation failed';

    component.showMessage('error', testMessage);

    expect(component.notificationMsg).toBe(testMessage);
    expect(component.icon).toBe('error');
    expect(component.class).toBe('color-error');
    expect(component.message.open).toHaveBeenCalled();
  });

  it('should show warning message', () => {
    vi.spyOn(component.message, 'open').mockImplementation(() => undefined);
    const testMessage = 'Warning: Check your input';

    component.showMessage('warn', testMessage);

    expect(component.notificationMsg).toBe(testMessage);
    expect(component.icon).toBe('priority_high');
    expect(component.class).toBe('color-warn');
    expect(component.message.open).toHaveBeenCalled();
  });

  it('should use default notification message if none provided', () => {
    vi.spyOn(component.message, 'open').mockImplementation(() => undefined);
    const previousMsg = component.notificationMsg;

    component.showMessage('success');

    expect(component.notificationMsg).toBe(previousMsg);
    expect(component.message.open).toHaveBeenCalled();
  });

  it('should subscribe to communication service on creation', () => {
    const commService = TestBed.inject(CommunicationService) as CommunicationService;
    vi.spyOn(component, 'showMessage').mockImplementation(() => undefined);

    commService.emitSuccess('Test success');

    expect(component.showMessage).toHaveBeenCalledWith('success', 'Test success');
  });

  it('should handle error from communication service', () => {
    const commService = TestBed.inject(CommunicationService) as CommunicationService;
    vi.spyOn(component, 'showMessage').mockImplementation(() => undefined);

    commService.emitError('Test error');

    expect(component.showMessage).toHaveBeenCalledWith('error', 'Test error');
  });

  it('should handle message from communication service', () => {
    const commService = TestBed.inject(CommunicationService) as CommunicationService;
    vi.spyOn(component, 'showMessage').mockImplementation(() => undefined);

    commService.emitMessage('Test warning');

    expect(component.showMessage).toHaveBeenCalledWith('warn', 'Test warning');
  });
});
