import 'zone.js/node';

import { APP_BASE_HREF } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { CommonEngine } from '@angular/ssr';
import express from 'express';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import bootstrap from './src/main.server';

import { environment } from '../common/src/environments/environment';

// The Express app is exported so that it can be used by serverless Functions.
export function app(lang: string): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), environment.distFolderEbleague, lang);
  let indexHtml = existsSync(join(distFolder, 'index.original.html'))
    ? join(distFolder, 'index.original.html')
    : join(distFolder, 'index.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Angular engine
  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    if (existsSync(join(process.cwd(), environment.distFolderEbleague, originalUrl, 'index.html'))) {
      indexHtml = join(process.cwd(), environment.distFolderEbleague, originalUrl, 'index.html');
    }

    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: distFolder,
        providers: [
          { provide: APP_BASE_HREF, useValue: baseUrl },
          { provide: LOCALE_ID, useValue: lang }
        ],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  // All bellumgens routes should redirect
  server.get('**/players/*', (req, res) => {
    res.redirect(environment.bellumgens + req.originalUrl);
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4001;

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
}

run();
