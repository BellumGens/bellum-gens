// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  ebleague: 'http://localhost:4201',
  bellumgens: 'http://localhost:4200',
  rootApiEndpoint: 'https://localhost:44348',
  // Public API root for links fetched from outside, e.g. social media previews, so it is never a local endpoint
  publicRootApiEndpoint: 'https://api.bellumgens.com',
  authApiEndpoint: 'https://localhost:44348/api/account',
  apiEndpoint: 'https://localhost:44348/api',
  distFolderEbleague: 'dist/ebleague/browser',
  distFolderBellumGens: 'dist/bellumgens/browser',
  VAPID_PUBLIC_KEY: 'BNmXyw15axbl9tOAKz0ybCcfui-w4WiILSO_PRvU2qF0gdB56C0jRieaFSncZnpaulsyl0c3VUsRCyOR4foil50'
};
