/**
 * Runs the Cypress suite against the production SSR builds of both sites.
 *
 * Starts `dist/bellumgens` on port 4000 and `dist/ebleague` on port 4001, waits until each
 * one answers, runs `cypress run` through scripts/cypress.js, then stops the servers. A server
 * that exits or never answers fails the run with that server's output instead of leaving
 * Cypress to report an unreachable baseUrl.
 *
 * The production builds only accept the hosts listed under `security.allowedHosts` in
 * angular.json, so every route that is not prerendered answers `localhost` with a 400.
 * NG_ALLOWED_HOSTS adds localhost at runtime without loosening the build configuration.
 *
 * Run `npm run build` first. Usage: node scripts/e2e.js [cypress run arguments...]
 */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const sites = [
  { name: 'bellumgens', port: 4000 },
  { name: 'ebleague', port: 4001 }
];
const startupTimeout = 60000;

const servers = [];

function stopServers() {
  for (const { child } of servers) {
    if (child.exitCode === null) {
      child.kill();
    }
  }
}

function fail(message) {
  console.error(`\n[e2e] ${message}`);
  stopServers();
  process.exit(1);
}

async function isUp(port) {
  try {
    await fetch(`http://localhost:${port}/`, { signal: AbortSignal.timeout(2000) });
    return true;
  } catch {
    return false;
  }
}

function startServer({ name, port }) {
  const entry = path.join(root, 'dist', name, 'server', 'server.mjs');
  if (!fs.existsSync(entry)) {
    fail(`${path.relative(root, entry)} not found. Run "npm run build" first.`);
  }
  const child = spawn(process.execPath, [entry], {
    cwd: root,
    env: { ...process.env, PORT: String(port), NG_ALLOWED_HOSTS: 'localhost' },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  const server = { name, port, child, output: '' };
  const log = (chunk) => {
    server.output += chunk;
    process.stdout.write(chunk.toString().replace(/^(?=.)/gm, `[${name}] `));
  };
  child.stdout.on('data', log);
  child.stderr.on('data', log);
  servers.push(server);
  return server;
}

async function waitForServer(server) {
  const deadline = Date.now() + startupTimeout;
  while (Date.now() < deadline) {
    if (server.child.exitCode !== null) {
      fail(`${server.name} server exited with code ${server.child.exitCode} before it answered on port ${server.port}.`);
    }
    if (await isUp(server.port)) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  fail(`${server.name} server did not answer on http://localhost:${server.port}/ within ${startupTimeout / 1000}s.`);
}

async function main() {
  // A server left over from an earlier run would answer in place of the build under test.
  for (const { name, port } of sites) {
    if (await isUp(port)) {
      fail(`Port ${port} (${name}) is already in use. Stop the process listening on it and try again.`);
    }
  }

  await Promise.all(sites.map(startServer).map(waitForServer));
  console.log(`[e2e] Servers ready: ${sites.map(({ port }) => `http://localhost:${port}`).join(', ')}`);

  const cypress = spawn(process.execPath, [path.join(__dirname, 'cypress.js'), 'run', ...process.argv.slice(2)], {
    cwd: root,
    stdio: 'inherit'
  });
  cypress.on('exit', (code) => {
    stopServers();
    process.exit(code === null ? 1 : code);
  });
}

process.on('SIGINT', () => fail('Interrupted.'));
main().catch((error) => fail(error.stack ?? String(error)));
