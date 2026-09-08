/**
 * Combines the per-project coverage reports into a single repo-wide report.
 *
 * `ng test` runs each Angular project as its own Vitest run, so every project writes a
 * separate report under `coverage/<project>`. Concatenating those lcov files does not
 * combine them: 65 source files are pulled into more than one project's run, so the
 * concatenation carries duplicate records for them, and an lcov consumer either sums the
 * duplicates (inflating the line total with lines that do not exist) or keeps one record
 * and discards the coverage recorded by the other runs. Both understate the real figure by
 * roughly twenty points.
 *
 * Merging the Istanbul JSON reports instead unions the hit counts per file, so a line
 * executed by any project counts as covered exactly once. The merged result is written as
 * `coverage/lcov.info` for Coveralls, plus a browsable HTML report for the whole repo.
 */
const fs = require('fs');
const path = require('path');
const libCoverage = require('istanbul-lib-coverage');
const libReport = require('istanbul-lib-report');
const reports = require('istanbul-reports');

const root = path.join(__dirname, '..');
const coverageDir = path.join(root, 'coverage');

if (!fs.existsSync(coverageDir)) {
  console.error('No coverage directory. Run `npm run test:prod -- --coverage` first.');
  process.exit(1);
}

// Every project report, whichever projects were run -- merging a subset is valid, so a
// single-project run followed by this script still produces a usable report.
const inputs = fs.readdirSync(coverageDir, { withFileTypes: true })
  .filter(entry => entry.isDirectory())
  .map(entry => path.join(coverageDir, entry.name, 'coverage-final.json'))
  .filter(file => fs.existsSync(file));

if (inputs.length === 0) {
  console.error('No coverage-final.json found under coverage/. Was --coverage passed to the test run?');
  process.exit(1);
}

// The reports key files by absolute path, so a file pulled into two projects' runs merges
// into a single entry here, its hit counts summed rather than duplicated.
const coverageMap = libCoverage.createCoverageMap({});

for (const input of inputs) {
  coverageMap.merge(JSON.parse(fs.readFileSync(input, 'utf8')));
}

const context = libReport.createContext({ dir: coverageDir, coverageMap });

// Coveralls matches records against repo-relative paths, so the absolute paths above have to
// come back out relative to the repo root rather than to the working directory.
reports.create('lcovonly', { file: 'lcov.info', projectRoot: root }).execute(context);

reports.create('html', { subdir: 'html' }).execute(context);
reports.create('text-summary').execute(context);

// That relative path is built with the platform separator, so merging on Windows produces
// backslash paths Coveralls cannot match. CI runs on Linux, where this rewrite is a no-op,
// but it keeps the artifact identical on either platform.
const lcovPath = path.join(coverageDir, 'lcov.info');
const toPosix = line => line.startsWith('SF:') ? 'SF:' + line.slice(3).split(path.sep).join('/') : line;

fs.writeFileSync(lcovPath, fs.readFileSync(lcovPath, 'utf8').split('\n').map(toPosix).join('\n'));

console.log(`Merged ${inputs.length} project reports covering ${coverageMap.files().length} files into coverage/lcov.info`);
