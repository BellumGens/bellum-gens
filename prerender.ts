// Code taken from TrilonIO/angular-universal-training
// https://github.com/TrilonIO/angular-universal-tutorial/tree/feat/prerendering
// Author: Mark Pieszak https://github.com/MarkPieszak

// Load zone.js for the server.
import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import {readFileSync, writeFileSync} from 'fs';
import {join} from 'path';

import {enableProdMode} from '@angular/core';
// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Import module map for lazy loading
import {provideModuleMap} from '@nguniversal/module-map-ngfactory-loader';
import {renderModuleFactory} from '@angular/platform-server';

(global as any).XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;

// Routes we want to Pre-Render
const ROUTES = [
  '/app-shell'
];

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const {AppServerModuleNgFactory, LAZY_MODULE_MAP} = require('./dist/server/main');

const BROWSER_FOLDER = join(process.cwd(), 'dist', 'browser');

// Load the index.html file containing referances to your application bundle.
const index = readFileSync(join(BROWSER_FOLDER, 'index.html'), 'utf8');

let previousRender = Promise.resolve();

// Iterate each route path
ROUTES.forEach(route => {
  // Uncomment when the rest of the prerender routes are defined!
  // const fullPath = join(BROWSER_FOLDER, route);

  // Make sure the directory structure is there
  // if (!existsSync(fullPath)) {
  //   mkdirSync(fullPath);
  // }

  // Writes rendered HTML to index.html, replacing the file if it already exists.
  previousRender = previousRender.then(_ => renderModuleFactory(AppServerModuleNgFactory, {
    document: index,
    url: route,
    extraProviders: [
      provideModuleMap(LAZY_MODULE_MAP)
    ]
  })).then(html => writeFileSync(join(BROWSER_FOLDER, 'index.html'), html));
});
