import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import compression from 'compression';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { environment } from '../common/src/environments/environment';

const app = express();
app.use(compression());

export function server(lang: string): express.Express {
  const app = express();
  const angularApp = new AngularNodeAppEngine();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser', lang);

  /**
   * The shop moved to bellumgens.com. Answer every /shop request with a permanent redirect to the
   * same path there. `req.originalUrl` still carries the language mount (/bg or /en) and any query
   * string, so the visitor lands on the shop in the language they were browsing in.
   */
  app.use('/shop', (req, res) => {
    res.redirect(301, `${environment.bellumgens}${req.originalUrl}`);
  });

  /**
   * Serve static files from /browser
   */
  app.use(
    express.static(browserDistFolder, {
      maxAge: '1y'
    }),
  );

  /**
   * Handle all other requests by rendering the Angular application.
   */
  app.use('/{*splat}', (req, res, next) => {
    angularApp
      .handle(req)
      .then((response) =>
        response ? writeResponseToNodeResponse(response, res) : next(),
      )
      .catch(next);
  });

  return app;
}

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4001.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4001;
  const appBG = server('bg');
  const appEN = server('en');
  app.use('/bg', appBG);
  app.use('/en', appEN);
  app.use('', appEN);
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * The request handler used by the Angular CLI (dev-server and during build).
 */
export const reqHandler = createNodeRequestHandler(app);
