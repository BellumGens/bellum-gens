/**
 * Runs the Cypress CLI with ELECTRON_RUN_AS_NODE removed from the environment.
 *
 * Electron-based hosts (VS Code extension terminals, editor-spawned tasks, AI coding assistants)
 * pass ELECTRON_RUN_AS_NODE=1 down to their child processes. The Cypress CLI reads that variable
 * as a request to run its Electron binary as plain Node, so the binary rejects Cypress's own flags
 * and every run dies at the smoke test with "Cypress.exe: bad option: --smoke-test".
 *
 * Usage: node scripts/cypress.js <run|open> [cypress arguments...]
 */
const { spawnSync } = require('child_process');
const path = require('path');

const env = { ...process.env };
delete env.ELECTRON_RUN_AS_NODE;

const cli = path.join(__dirname, '..', 'node_modules', 'cypress', 'bin', 'cypress');
const result = spawnSync(process.execPath, [cli, ...process.argv.slice(2)], { stdio: 'inherit', env });

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}
process.exit(result.status === null ? 1 : result.status);
