/**
 * Keeps every translation file in step with the extracted source messages.
 *
 * For each app in angular.json with i18n locales, every `messages.<locale>.xlf` is rebuilt from the
 * source locale's `messages.en.xlf` (run `npm run i18n` first):
 *   - translations of units whose source text is unchanged are kept, with their placeholders refreshed;
 *   - units no longer in the source are dropped;
 *   - new units, units whose source text changed, and translations whose placeholders no longer match
 *     the source are left without a <target> and reported. Angular renders such units in English
 *     without failing the build, so the run exits with 1 to make them visible.
 *
 * Usage (npm run i18n:sync -- <options>):
 *   (no options)      rewrite the translation files and report what is missing
 *   --check           report only, write nothing; exits with 1 when something is missing or stale
 *   --export <dir>    also write the missing units of each locale to <dir>/<locale>.json
 *   --import <dir>    apply the translations in <dir>/<locale>.json before rebuilding
 *   --locale <code>   limit the run to one locale (repeatable)
 *
 * The exported JSON maps unit ids to { en, file, translation }. Fill in `translation` and import the same
 * file. Units shared by both apps are listed once. Inline markup and interpolations appear as tokens like
 * `{$INTERPOLATION}` or `{$START_TAG_SPAN}`: a translation must keep each of them (in any order) and is
 * otherwise plain text, so write `&` and `<` as they are.
 */
const fs = require('fs');
const path = require('path');

const root = process.cwd();

// ── Arguments ────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const options = { check: false, exportDir: undefined, importDir: undefined, locales: [] };
for (let i = 0; i < args.length; i++) {
  const value = () => {
    if (!args[i + 1]) {
      fail(`${args[i]} needs a value`);
    }
    return args[++i];
  };
  switch (args[i]) {
    case '--check': options.check = true; break;
    case '--export': options.exportDir = path.resolve(root, value()); break;
    case '--import': options.importDir = path.resolve(root, value()); break;
    case '--locale': options.locales.push(value()); break;
    default: fail(`Unknown option ${args[i]}`);
  }
}

function fail(message) {
  console.error(`[i18n-sync] ${message}`);
  process.exit(2);
}

// ── XLIFF 1.2 helpers ────────────────────────────────────────────────────────

const ENTITIES = { lt: '<', gt: '>', amp: '&', quot: '"', apos: "'" };
const decode = s => s
  .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
  .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
  .replace(/&(lt|gt|amp|quot|apos);/g, (_, e) => ENTITIES[e]);
const encode = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const TOKEN = /(\{\$[A-Za-z0-9_]+\})/;

/** id -> { source, target } with the raw XML of the unit's <source> and <target>. */
function parseUnits(xml) {
  const units = new Map();
  for (const [, id, body] of xml.matchAll(/<trans-unit id="([^"]+)"[^>]*>([\s\S]*?)<\/trans-unit>/g)) {
    units.set(id, {
      source: body.match(/<source>([\s\S]*?)<\/source>/)[1],
      target: body.match(/<target[^>]*>([\s\S]*?)<\/target>/)?.[1]
    });
  }
  return units;
}

/** Raw XML -> plain text with a `{$ID}` token per inline element, plus those elements by id. */
function toText(xml) {
  const elements = new Map();
  const text = xml.split(/(<x [^>]*\/>)/).map((part, i) => {
    if (i % 2) {
      const id = part.match(/id="([^"]+)"/)[1];
      elements.set(id, part);
      return `{$${id}}`;
    }
    return decode(part);
  }).join('');
  return { text, elements };
}

/** Plain text with tokens -> raw XML, taking the inline elements from the source. */
const toXml = (text, elements) => text.split(TOKEN)
  .map((part, i) => i % 2 ? elements.get(part.slice(2, -1)) : encode(part))
  .join('');

const tokens = text => text.split(TOKEN).filter((_, i) => i % 2).sort().join();

/** Comparable source text: ignores the source's line wrapping and the placeholders' equiv-text. */
const normalize = text => text.replace(/\s+/g, ' ').trim();

// ── Sync ─────────────────────────────────────────────────────────────────────

const angularJson = JSON.parse(fs.readFileSync(path.join(root, 'angular.json'), 'utf8'));
const apps = Object.entries(angularJson.projects)
  .filter(([, project]) => project.i18n?.locales)
  .map(([name, project]) => ({
    name,
    sourceLocale: project.i18n.sourceLocale ?? 'en-US',
    locales: Object.entries(project.i18n.locales).map(([code, file]) => ({ code, file: typeof file === 'string' ? file : file.translation }))
  }));

/** Reads <dir>/<locale>.json: id -> translation text (or { translation }). */
function readImport(code) {
  const file = path.join(options.importDir, `${code}.json`);
  if (!fs.existsSync(file)) {
    return new Map();
  }
  const entries = Object.entries(JSON.parse(fs.readFileSync(file, 'utf8')))
    .map(([id, value]) => [id, typeof value === 'string' ? value : value?.translation])
    .filter(([, text]) => typeof text === 'string' && text.trim());
  return new Map(entries);
}

let problems = 0;
const missingByLocale = new Map();
const imports = new Map();

for (const app of apps) {
  for (const locale of app.locales) {
    if (options.locales.length && !options.locales.includes(locale.code)) {
      continue;
    }
    const localePath = path.join(root, locale.file);
    const sourcePath = path.join(path.dirname(localePath), `messages.${app.sourceLocale}.xlf`);
    if (!fs.existsSync(sourcePath)) {
      fail(`${path.relative(root, sourcePath)} not found. Run "npm run i18n" first.`);
    }
    const sourceXml = fs.readFileSync(sourcePath, 'utf8');
    const existing = fs.existsSync(localePath) ? parseUnits(fs.readFileSync(localePath, 'utf8')) : new Map();
    if (options.importDir && !imports.has(locale.code)) {
      imports.set(locale.code, readImport(locale.code));
    }
    const imported = imports.get(locale.code) ?? new Map();

    const stats = { kept: 0, imported: 0, missing: 0, invalid: [] };
    const sourceIds = new Set();
    const output = sourceXml.replace(
      /(<trans-unit id="([^"]+)"[^>]*>(\s*)<source>([\s\S]*?)<\/source>)([\s\S]*?<\/trans-unit>)/g,
      (match, head, id, whitespace, sourceXmlOfUnit, tail) => {
        sourceIds.add(id);
        const source = toText(sourceXmlOfUnit);
        let text;
        if (imported.has(id)) {
          text = imported.get(id);
          if (tokens(text) !== tokens(source.text)) {
            stats.invalid.push(`${id}: imported translation must contain ${tokens(source.text) || 'no placeholders'}`);
            text = undefined;
          } else {
            stats.imported++;
          }
        }
        const previous = existing.get(id);
        if (text === undefined && previous?.target !== undefined
          && normalize(toText(previous.source).text) === normalize(source.text)) {
          const kept = toText(previous.target).text;
          if (tokens(kept) === tokens(source.text)) {
            text = kept;
            stats.kept++;
          } else {
            stats.invalid.push(`${id}: placeholders of the translation do not match the source`);
          }
        }
        if (text === undefined) {
          stats.missing++;
          const missing = missingByLocale.get(locale.code) ?? new Map();
          const file = tail.match(/context-type="sourcefile">([^<]+)</)?.[1];
          missing.set(id, { en: normalize(source.text), file, translation: '' });
          missingByLocale.set(locale.code, missing);
          return match;
        }
        return `${head}${whitespace}<target>${toXml(text, source.elements)}</target>${tail}`;
      }
    );
    const dropped = [...existing.keys()].filter(id => !sourceIds.has(id)).length;
    const current = fs.existsSync(localePath) ? fs.readFileSync(localePath, 'utf8') : undefined;
    const outdated = output !== current;

    const label = `${app.name} ${locale.code}`.padEnd(24);
    console.log(`${label} kept ${stats.kept}, imported ${stats.imported}, missing ${stats.missing}, dropped ${dropped}`
      + (options.check && outdated ? ' (out of date)' : ''));
    stats.invalid.forEach(message => console.log(`  ! ${message}`));
    if (stats.missing || stats.invalid.length || (options.check && outdated)) {
      problems++;
    }
    if (!options.check && outdated) {
      fs.writeFileSync(localePath, output);
    }
  }
}

if (options.exportDir) {
  fs.mkdirSync(options.exportDir, { recursive: true });
  for (const [code, units] of missingByLocale) {
    const file = path.join(options.exportDir, `${code}.json`);
    fs.writeFileSync(file, `${JSON.stringify(Object.fromEntries(units), null, 2)}\n`);
    console.log(`Exported ${units.size} missing unit(s) to ${path.relative(root, file)}`);
  }
}

if (problems) {
  console.log(options.check
    ? '\nTranslation files are out of date. Run "npm run i18n:sync" and translate the missing units.'
    : '\nSome units have no translation and will render in English until translated (see --export / --import).');
  process.exitCode = 1;
}
