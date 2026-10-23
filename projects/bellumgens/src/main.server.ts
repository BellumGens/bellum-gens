import { bootstrapApplication, BootstrapContext } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';
import { config as rxjsConfig } from 'rxjs';

// RxJS rethrows unhandled observable errors asynchronously, which on the server is an uncaught exception that
// takes down the whole Node process. Log them instead, so a failed API call only affects the render that made it.
rxjsConfig.onUnhandledError = error => console.error(error);

const bootstrap = (context: BootstrapContext) => bootstrapApplication(AppComponent, config, context);

export default bootstrap;
