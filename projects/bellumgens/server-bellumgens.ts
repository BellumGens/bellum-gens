/***************************************************************************************************
 * Load `$localize` onto the global scope - used if i18n tags appear in Angular templates.
 */
import '@angular/localize/init';
import 'zone.js/node';

import { APP_BASE_HREF } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { ngExpressEngine } from '@nguniversal/express-engine';

import * as express from 'express';
import { join } from 'path';

import { AppServerModule } from './src/main.server';
import { existsSync } from 'fs';
import { environment } from '../common/src/environments/environment';

// The Express app is exported so that it can be used by serverless Functions.
export const app = (lang: string) => {
  const server = express();
  let distFolder = join(process.cwd(), environment.distFolderBellumGens, lang);

  if (!existsSync(distFolder)) {
    distFolder = join(process.cwd(), environment.distFolderBellumGens);
  }

  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  const compression = require('compression');
  server.use(compression());

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule,
  }));

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // app.get('/api/**', (req, res) => { });
  // Serve static files from /browser with 1 year caching
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }, { provide: LOCALE_ID, useValue: lang }] });
  });

  return server;
};

const run = () => {
  const port = process.env.PORT || 4000;

  // Start up the Node server
  const appBg = app('bg');
  const appEn = app('en');
  const server = express();
  server.use('/bg', appBg);
  server.use('/en', appEn);
  server.use('', appEn);
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
};

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
