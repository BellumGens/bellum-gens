import { defineConfig } from 'vitest/config';

// Shared Vitest configuration for all three projects, referenced by the `runnerConfig`
// option of the `@angular/build:unit-test` targets in angular.json. The Angular builder
// supplies everything else (environment, globals, setup files, coverage).
export default defineConfig({
  test: {
    environmentOptions: {
      jsdom: {
        // Karma served the specs from its own origin, which environment.unit.ts pointed
        // `bellumgens` at, so code branching on window.location.href took the in-app path.
        // jsdom defaults to localhost:3000, so the origin is pinned to the environment's
        // bellumgens URL to keep that branch reachable.
        url: 'http://localhost:4200/'
      }
    },
    server: {
      deps: {
        // igniteui-angular-i18n declares "type": "module" but its re-exports omit file
        // extensions, which Node's ESM loader rejects. The builder externalizes packages
        // by default, so this one has to be inlined for Vite to resolve it.
        inline: ['igniteui-angular-i18n']
      }
    }
  }
});
