import { enableProdMode } from '@angular/core';

import { environment } from '../src-common/environments/environment';

if (environment.production) {
  enableProdMode();
}

export { AppServerModule } from './app/app.server.module';
