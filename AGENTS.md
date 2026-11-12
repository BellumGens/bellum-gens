You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Do NOT set `changeDetection: ChangeDetectionStrategy.OnPush` in the `@Component` decorator. OnPush is the default in Angular v22+, and the apps are zoneless.
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

## UI components

- Use `igniteui-angular`.

## Internationalization (i18n)

Both apps (`bellum-gens`, `eb-league`) are localized with `@angular/localize`. English (`en`) is the source locale. The translations are `bg`, `de`, `fr`, `nl`, `nb` (Norwegian Bokmål), `sv`, `pl` and `ro`, in `projects/<app>/src/locale/messages.<locale>.xlf`. Each locale is a separate build served under its own URL prefix (`/de/...`). On a first load without a prefix, the SSR server redirects to the visitor's language: their earlier pick (the `locale` cookie set by the language switcher), else `Accept-Language`, else English.

### Marking text

- Mark ALL user-visible text for translation: `i18n` on elements, `i18n-<attribute>` for attributes (`title`, `placeholder`, `aria-label`, `alt`, `igxLabel`...), and `` $localize`...` `` in TypeScript (use a custom id, e.g. `` $localize`:@@shopCartInvalid:...` ``, like the existing ones).
- Do NOT build sentences from fragments, and do NOT pass hard-coded English through interpolations (e.g. `{{ loggedIn ? 'Leave a' : 'Login to' }} comment`). Translators only see `{$INTERPOLATION}`, so those words stay English in every locale. Write each variant as its own `i18n` string, or use an ICU `select`.
- Use ICU `plural` for anything with a count (`{count, plural, =1 {1 option} other {{{count}} options}}`); several locales (pl, ro) have more than two plural forms.
- Add a meaning and description when a short string is ambiguous out of context: `<span i18n="shop product type|A badge pin sold in the shop">Pin</span>`.
- Locale-specific code must work for every locale: never branch on `localeId === 'bg'` alone. Use the list and helpers in `projects/common/src/lib/languages/languages.ts` (`LANGUAGES`, `matchLocale`, `SOURCE_LOCALE`).
- Links between the two apps must include the locale prefix (see `shopRedirectUrl` in `projects/ebleague/src/app/guards/shop-redirect.guard.ts`). In-app router links already resolve against the locale's base href.

### Translating new or changed strings

Whenever you add or change marked text, translate it into EVERY locale in the same change. Don't leave it for later: a unit without a translation silently renders in English, because the build does not fail on it.

1. `npm run i18n` extracts the source messages (`messages.en.xlf`). Never edit `messages.en.xlf` by hand.
2. `npm run i18n:sync -- --export <dir>` updates every translation file and writes each locale's missing units to `<dir>/<locale>.json`. Use a directory outside the repository, such as the OS temp dir.
3. Fill in the `translation` field of every entry, in every file:
   - Keep each placeholder token (`{$INTERPOLATION}`, `{$START_TAG_SPAN}`, `{$count}`...) exactly as written. You may reorder tokens, but don't add or remove any.
   - Write plain text (`&`, `<`, quotes as they are); the script escapes it.
   - Use `file` to look at the template when a string is ambiguous.
4. `npm run i18n:sync -- --import <dir>` writes the translations into the `.xlf` files. It rejects translations whose placeholders don't match the source.
5. `npm run i18n:sync -- --check` must exit with 0 before you finish.

Don't hand-edit the structure of the `.xlf` files; let `i18n:sync` maintain them. Preview a locale with `ng serve <app> --configuration=<locale>`.

### Translation style

- Keep brand, product and proper names untranslated: Bellum Gens, Bellum Gens Elite, BGE, EB League, Steam, Discord, Twitch, Battle.net, CS2, Counter-Strike, StarCraft II, partner and venue names. Gaming jargon the local community uses in English stays English (AWPer, IGL, entry fragger, lurker).
- Match the register already used in each locale's file:
  - informal "du" in de, nb and sv; "je" in nl; "ty" in pl; "tu" in ro;
  - "vous" in fr;
  - bg: follow the surrounding translations;
  - legal text (shop terms, privacy, returns) uses a formal legal style.
- Keep UI labels (buttons, menu items, column headers) as short as the English.

### Adding a locale

Add it to all of the following; nothing derives one from another:

- `LANGUAGES` in `projects/common/src/lib/languages/languages.ts` (code, native label, flag in `assets/country-flags/svg`);
- `i18n.locales` and a `build`/`serve` configuration for both apps in `angular.json`;
- the Ignite UI strings map in `projects/common/src/lib/languages/igx-resource-strings.ts`, when `igniteui-angular-i18n` has the language.

Then run `npm run i18n:sync -- --export <dir>` to create the new translation files, and translate every entry as above.
