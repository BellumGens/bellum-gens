// Global test setup, shared by all three projects via the `setupFiles` option of
// the `@angular/build:unit-test` targets in angular.json.

// zone.js/testing only patches Jasmine and Mocha. Under Vitest the describe/it bodies
// need this additional patch to run inside a ProxyZone, which Angular's waitForAsync()
// and fakeAsync() require.
import 'zone.js/plugins/vitest-patch';

// The tests used to run in a real Chrome instance under Karma. They now run in jsdom,
// which implements none of the APIs below -- yet Ignite UI components and a few of our
// own components call them while rendering. Each stub is only installed if missing, so
// a real browser environment (Vitest browser mode) keeps its native implementation.

if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => undefined,
    removeListener: () => undefined,
    addEventListener: () => undefined,
    removeEventListener: () => undefined,
    dispatchEvent: () => false
  }) as MediaQueryList;
}

if (typeof window !== 'undefined' && !window.ResizeObserver) {
  window.ResizeObserver = class {
    public observe() { }
    public unobserve() { }
    public disconnect() { }
  } as unknown as typeof ResizeObserver;
}

if (typeof Element !== 'undefined' && !Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => undefined;
}

// IgxStylesRegistrar registers every component stylesheet by spreading `document.adoptedStyleSheets`,
// which jsdom does not implement at all, so constructing any component that uses it (igx-grid, via
// IgxGridBaseDirective) throws "adoptedStyleSheets is not iterable". The stub is an own property of
// the document instance rather than of `Document.prototype` on purpose: Lit -- which backs
// igniteui-webcomponents -- feature-detects constructable stylesheets with
// `'adoptedStyleSheets' in Document.prototype` and would switch to a shadow-root code path jsdom
// cannot support. jsdom's CSSStyleSheet is constructable and implements replaceSync, so the sheets
// the registrar puts here are real; nothing applies them, which is fine as no test asserts on styling.
if (typeof document !== 'undefined' && !('adoptedStyleSheets' in document)) {
  document.adoptedStyleSheets = [];
}

// jsdom ships no canvas backend, so getContext('2d') returns null and it never loads images.
// Both gaps are stubbed below rather than by installing the `canvas` package, which needs a
// native build. The strat-editor tests assert *which* context calls a layer makes, not what
// gets rasterized, so no-op doubles keep them meaningful.
const noCanvasBackend = typeof HTMLCanvasElement !== 'undefined'
  && document.createElement('canvas').getContext('2d') === null;

// Only the context members the strat-editor models actually touch are provided; extend this
// list if they start using more.
if (noCanvasBackend) {
  HTMLCanvasElement.prototype.getContext = function (contextId: string) {
    if (contextId !== '2d') {
      return null;
    }

    return {
      strokeStyle: '',
      lineWidth: 1,
      arc: () => undefined,
      beginPath: () => undefined,
      clearRect: () => undefined,
      clip: () => undefined,
      closePath: () => undefined,
      drawImage: () => undefined,
      lineTo: () => undefined,
      moveTo: () => undefined,
      restore: () => undefined,
      save: () => undefined,
      stroke: () => undefined,
      strokeRect: () => undefined
    };
  } as typeof HTMLCanvasElement.prototype.getContext;
}

// Without a canvas backend jsdom never fires `load` on an image, so code that draws inside
// img.onload never runs and its tests just time out. ImageLayer.draw() is one of those, and its
// load handler only reads the layer's own metadata, so resolving the load synthetically
// exercises it in full.
if (noCanvasBackend) {
  const nativeSrc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');

  if (nativeSrc?.set) {
    Object.defineProperty(HTMLImageElement.prototype, 'src', {
      ...nativeSrc,
      set(value: string) {
        nativeSrc.set.call(this, value);
        // A macrotask, so a handler assigned right after `src` is still registered in time.
        setTimeout(() => this.dispatchEvent(new Event('load')), 0);
      }
    });
  }
}

// Under Vitest's jsdom environment the global AbortController is Node's, so its signals are
// not jsdom EventTargets. jsdom's addEventListener rejects them with "not a valid instance of
// EventTarget", which breaks every component that passes { signal } to addEventListener --
// igx-grid's scroll inertia directive does exactly that, taking every grid test down with it.
// Subclassing the DOM's own EventTarget produces a signal jsdom accepts.
if (typeof window !== 'undefined' && !(new AbortController().signal instanceof window.EventTarget)) {
  class JsdomAbortSignal extends EventTarget {
    public aborted = false;
    public reason: unknown = undefined;
    public onabort: ((event: Event) => void) | null = null;

    public throwIfAborted() {
      if (this.aborted) {
        throw this.reason;
      }
    }
  }

  class JsdomAbortController {
    public readonly signal = new JsdomAbortSignal();

    public abort(reason?: unknown) {
      if (this.signal.aborted) {
        return;
      }
      this.signal.aborted = true;
      this.signal.reason = reason ?? new DOMException('This operation was aborted', 'AbortError');

      const event = new Event('abort');
      this.signal.onabort?.(event);
      this.signal.dispatchEvent(event);
    }
  }

  globalThis.AbortController = JsdomAbortController as unknown as typeof AbortController;
  globalThis.AbortSignal = JsdomAbortSignal as unknown as typeof AbortSignal;
}
