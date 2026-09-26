import { ErrorHandler } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { config, throwError } from 'rxjs';
import { provideUnhandledRxjsErrors } from './unhandled-rxjs-errors';

describe('provideUnhandledRxjsErrors', () => {
  let handleError: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    handleError = vi.fn();
    TestBed.configureTestingModule({
      providers: [
        provideUnhandledRxjsErrors(),
        { provide: ErrorHandler, useValue: { handleError } }
      ]
    });
    TestBed.inject(ErrorHandler);
  });

  afterEach(() => {
    config.onUnhandledError = null;
  });

  it('should route errors from subscriptions without an error callback to the ErrorHandler', async () => {
    const error = new Error('request failed');
    throwError(() => error).subscribe();

    // RxJS reports unhandled errors asynchronously
    await new Promise(resolve => setTimeout(resolve));

    expect(handleError).toHaveBeenCalledWith(error);
  });

  it('should not report errors that the subscriber handles', async () => {
    throwError(() => new Error('handled')).subscribe({ error: () => undefined });

    await new Promise(resolve => setTimeout(resolve));

    expect(handleError).not.toHaveBeenCalled();
  });
});
