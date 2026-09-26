import { EnvironmentProviders, ErrorHandler, inject, provideEnvironmentInitializer } from '@angular/core';
import { config } from 'rxjs';

/**
 * Routes errors from subscriptions without an error callback to Angular's ErrorHandler.
 *
 * RxJS reports those by rethrowing them from a setTimeout. zone.js used to catch that and hand it to the
 * ErrorHandler; without zone.js it's an uncaught exception, which on the server takes down the Node process
 * (a single failed API call during SSR would stop the whole server).
 */
export function provideUnhandledRxjsErrors(): EnvironmentProviders {
  return provideEnvironmentInitializer(() => {
    const errorHandler = inject(ErrorHandler);
    config.onUnhandledError = error => errorHandler.handleError(error);
  });
}
