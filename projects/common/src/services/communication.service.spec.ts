import { TestBed } from '@angular/core/testing';
import { CommunicationService } from './communication.service';

describe('CommunicationService', () => {
  let service: CommunicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommunicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should emit success event', () => {
    const successMessage = 'Success message';
    let emittedSuccessMessage: string | undefined;

    service.success.subscribe((message: string) => {
      emittedSuccessMessage = message;
    });

    service.emitSuccess(successMessage);

    expect(emittedSuccessMessage).toBe(successMessage);
  });

  it('should emit error event', () => {
    const errorMessage = 'Error message';
    let emittedErrorMessage: string | undefined;

    service.error.subscribe((message: string) => {
      emittedErrorMessage = message;
    });

    service.emitError(errorMessage);

    expect(emittedErrorMessage).toBe(errorMessage);
  });

  it('should emit message event', () => {
    const message = 'Test message';
    let emittedMessage: string | undefined;

    service.message.subscribe((msg: string) => {
      emittedMessage = msg;
    });

    service.emitMessage(message);

    expect(emittedMessage).toBe(message);
  });
});
