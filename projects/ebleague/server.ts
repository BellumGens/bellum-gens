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
import { environment } from 'bellum-gens-common/environments';
import { LOCALE_CODES, SOURCE_LOCALE } from '../common/src/lib/languages/languages';
import { localeRedirect } from '../common/src/server/locale-redirect';

const app = express();
app.use(compression());

export function server(): express.Express {
  const site = express();
  // The engine picks the localized build from the locale prefix of the URL.
  const angularApp = new AngularNodeAppEngine();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');

  for (const locale of LOCALE_CODES) {
    /**
     * The shop moved to bellumgens.com. Answer every /shop request with a permanent redirect to the
     * same path there. `req.originalUrl` still carries the locale prefix and any query string, so the
     * visitor lands on the shop in the language they were browsing in.
     */
    site.use(`/${locale}/shop`, (req, res) => {
      res.redirect(301, `${environment.bellumgens}${req.originalUrl}`);
    });

    /**
     * Serve static files of each localized build under its locale prefix.
     */
    site.use(`/${locale}`, express.static(resolve(browserDistFolder, locale), { maxAge: '1y' }));
  }

  /**
   * Files referenced by absolute path (/assets, /favicon.ico, /robots.txt...) are the same in every build.
   * Only files are served here: pages without a locale fall through to the redirect below.
   */
  site.use(express.static(resolve(browserDistFolder, SOURCE_LOCALE), { maxAge: '1y', index: false, redirect: false }));

  /**
   * Send first loads without a locale in the URL to the visitor's language.
   */
  site.use(localeRedirect());

  /**
   * Handle all other requests by rendering the Angular application.
   */
  site.use('/{*splat}', (req, res, next) => {
    angularApp
      .handle(req)
      .then((response) =>
        response ? writeResponseToNodeResponse(response, res) : next(),
      )
      .catch(next);
  });

  return site;
}

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4001.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4001;
  app.use(server());
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

/**
 * The request handler used by the Angular CLI (dev-server and during build).
 */
export const reqHandler = createNodeRequestHandler(app);
