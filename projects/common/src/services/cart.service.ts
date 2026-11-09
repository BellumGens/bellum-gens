import { Injectable, PLATFORM_ID, computed, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Subject, merge, of, timer } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { ApiShopService } from './bellumgens-api.shop.service';
import { CommunicationService } from './communication.service';
import { AVAILABLE_DELIVERY_METHODS, CartItem, CartLineRequest, DeliveryMethod, Product, ProductVariant, Quote, QuoteRequest } from '../models/shop';

/** An order placed from the cart that has not been paid yet. */
export interface PendingOrder {
  id: string;
  /** Fingerprint of the order request it was placed with, so checkout can tell whether the cart still matches it. */
  fingerprint: string;
}

interface StoredCart {
  items: CartItem[];
  promoCode: string | null;
  deliveryMethod: DeliveryMethod;
  pendingOrder?: PendingOrder | null;
}

/**
 * A short, stable fingerprint of a value. Lets the cart recognise an order request without keeping the
 * customer's details in storage. Not a security measure.
 */
export const fingerprint = (value: unknown) => {
  const text = JSON.stringify(value);
  let hash = 5381;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) + hash + text.charCodeAt(i)) | 0;
  }
  return `${text.length.toString(36)}-${(hash >>> 0).toString(36)}`;
};

/**
 * The shopping cart. Lives in memory, mirrored to localStorage in the browser, and re-priced by the API
 * whenever its contents change so the totals shown are always the server's.
 *
 * Placing an order does not empty the cart: the customer may still back out of the payment. The order is kept as
 * the pending order instead, so paying again resumes it, and the cart is emptied once the order is paid.
 */
@Injectable({
  providedIn: 'root'
})
export class CartService {
  public static readonly storageKey = 'bg-shop-cart';
  /** The most of one product option a single order can hold. */
  public static readonly maxLineQuantity = 10;
  private static readonly quoteDebounce = 250;

  private platformId = inject(PLATFORM_ID);
  private shopApi = inject(ApiShopService);
  private commService = inject(CommunicationService);
  private isBrowser = isPlatformBrowser(this.platformId);

  private _items = signal<CartItem[]>([]);
  private _promoCode = signal<string | null>(null);
  private _deliveryMethod = signal<DeliveryMethod>(DeliveryMethod.Courier);
  private _quote = signal<Quote | null>(null);
  private _quoting = signal(false);
  private _quoteFailed = signal(false);
  private _pendingOrder = signal<PendingOrder | null>(null);

  public readonly items = this._items.asReadonly();
  public readonly promoCode = this._promoCode.asReadonly();
  public readonly deliveryMethod = this._deliveryMethod.asReadonly();
  /** Latest server quote for the cart, null while empty or before the first response. */
  public readonly quote = this._quote.asReadonly();
  public readonly quoting = this._quoting.asReadonly();
  /** True when the last quote request failed, so the UI can offer a retry instead of waiting forever. */
  public readonly quoteFailed = this._quoteFailed.asReadonly();
  /** The unpaid order last placed from this cart, if any. */
  public readonly pendingOrder = this._pendingOrder.asReadonly();

  public readonly count = computed(() => this.items().reduce((sum, item) => sum + item.quantity, 0));
  public readonly isEmpty = computed(() => this.items().length === 0);

  /**
   * Whether the latest quote allows placing the order. Besides unavailable lines, a promo code that does not apply
   * blocks checkout until it is removed: the API refuses such an order rather than charge more than the customer expects.
   */
  public readonly canCheckout = computed(() => {
    const quote = this.quote();
    return !!quote?.isValid && (!quote.promoCode || quote.promoApplied) && !this.quoting();
  });

  public readonly lines = computed<CartLineRequest[]>(() =>
    this.items().map(item => ({ productId: item.productId, variantId: item.variantId, quantity: item.quantity })));

  public readonly request = computed<QuoteRequest>(() => ({
    lines: this.lines(),
    promoCode: this.promoCode(),
    deliveryMethod: this.deliveryMethod()
  }));

  private request$ = toObservable(this.request);
  private refresh$ = new Subject<void>();

  constructor() {
    this.restore();

    effect(() => {
      const snapshot: StoredCart = {
        items: this.items(),
        promoCode: this.promoCode(),
        deliveryMethod: this.deliveryMethod(),
        pendingOrder: this.pendingOrder()
      };
      this.persist(snapshot);
    });

    if (this.isBrowser) {
      // Cart changes and manual refreshes share one stream, so any newer request cancels the one in flight
      // right away; only the start of a request caused by a cart change is debounced.
      merge(
        this.request$.pipe(map(request => ({ request, delay: CartService.quoteDebounce }))),
        this.refresh$.pipe(map(() => ({ request: this.request(), delay: 0 })))
      ).pipe(
        tap(({ request }) => this._quoting.set(request.lines.length > 0)),
        switchMap(({ request, delay }) => {
          if (!request.lines.length) {
            return of({ quote: null, failed: false });
          }
          return delay ? timer(delay).pipe(switchMap(() => this.fetchQuote(request))) : this.fetchQuote(request);
        }),
        takeUntilDestroyed()
      ).subscribe(result => this.setQuote(result));
    }
  }

  public add(product: Product, variant?: ProductVariant | null, quantity = 1) {
    if (quantity < 1) {
      return;
    }
    const variantId = variant?.id;
    this._items.update(items => {
      const existing = items.find(i => i.productId === product.id && i.variantId === variantId);
      if (existing) {
        const total = Math.min(existing.quantity + quantity, CartService.maxLineQuantity);
        return items.map(i => i === existing ? { ...i, quantity: total, product, variant: variant ?? undefined } : i);
      }
      return [...items, { productId: product.id, variantId, quantity: Math.min(quantity, CartService.maxLineQuantity), product, variant: variant ?? undefined }];
    });
    const label = variant ? `${product.name} (${variant.name})` : product.name;
    this.commService.emitSuccess($localize`:@@shopAddedToCart:${label}:name: added to your cart`);
  }

  public setQuantity(item: CartItem, quantity: number) {
    if (quantity < 1) {
      this.remove(item);
      return;
    }
    const capped = Math.min(quantity, CartService.maxLineQuantity);
    this._items.update(items => items.map(i => this.same(i, item) ? { ...i, quantity: capped } : i));
  }

  public remove(item: CartItem) {
    this._items.update(items => items.filter(i => !this.same(i, item)));
  }

  public clear() {
    this._items.set([]);
    this._promoCode.set(null);
    this._quote.set(null);
    this._quoteFailed.set(false);
    this._pendingOrder.set(null);
  }

  /** Remembers the order just placed from the cart, with the fingerprint of the request it was placed with. */
  public setPendingOrder(id: string, requestFingerprint: string) {
    this._pendingOrder.set({ id, fingerprint: requestFingerprint });
  }

  /** The pending order's id when it was placed with this exact request, so paying again can resume it. */
  public pendingOrderFor(requestFingerprint: string) {
    const pending = this.pendingOrder();
    return pending?.fingerprint === requestFingerprint ? pending.id : null;
  }

  public forgetPendingOrder() {
    this._pendingOrder.set(null);
  }

  public setPromoCode(code: string | null) {
    const normalized = code?.trim().toUpperCase() || null;
    this._promoCode.set(normalized);
  }

  public setDeliveryMethod(method: DeliveryMethod) {
    this._deliveryMethod.set(method);
  }

  /** Asks the API for fresh prices right away, e.g. after a rejected checkout. */
  public refresh() {
    if (!this.isBrowser || this.items().length === 0) {
      return;
    }
    this.refresh$.next();
  }

  private fetchQuote(request: QuoteRequest) {
    return this.shopApi.quote(request).pipe(
      map(quote => ({ quote, failed: false })),
      catchError(() => of({ quote: null, failed: true }))
    );
  }

  private setQuote(result: { quote: Quote | null, failed: boolean }) {
    this._quote.set(result.quote);
    this._quoteFailed.set(result.failed);
    this._quoting.set(false);
  }

  private same(a: CartItem, b: CartItem) {
    return a.productId === b.productId && (a.variantId ?? null) === (b.variantId ?? null);
  }

  private restore() {
    if (!this.isBrowser) {
      return;
    }
    try {
      const raw = window.localStorage.getItem(CartService.storageKey);
      if (!raw) {
        return;
      }
      const stored = JSON.parse(raw) as StoredCart;
      if (Array.isArray(stored.items)) {
        this._items.set(stored.items.filter(i => i?.productId && i.product && i.quantity > 0));
      }
      this._promoCode.set(stored.promoCode ?? null);
      // A method saved while it was offered (e.g. event pickup) falls back to courier once it no longer is.
      if (stored.deliveryMethod === DeliveryMethod.EventPickup && AVAILABLE_DELIVERY_METHODS.includes(DeliveryMethod.EventPickup)) {
        this._deliveryMethod.set(DeliveryMethod.EventPickup);
      }
      if (typeof stored.pendingOrder?.id === 'string' && typeof stored.pendingOrder.fingerprint === 'string') {
        this._pendingOrder.set({ id: stored.pendingOrder.id, fingerprint: stored.pendingOrder.fingerprint });
      }
    } catch {
      try {
        window.localStorage.removeItem(CartService.storageKey);
      } catch {
        // Storage is blocked; the in-memory cart still works.
      }
    }
  }

  private persist(snapshot: StoredCart) {
    if (!this.isBrowser) {
      return;
    }
    try {
      if (snapshot.items.length === 0 && !snapshot.promoCode && !snapshot.pendingOrder) {
        window.localStorage.removeItem(CartService.storageKey);
      } else {
        window.localStorage.setItem(CartService.storageKey, JSON.stringify(snapshot));
      }
    } catch {
      // Storage may be full or blocked; the in-memory cart still works.
    }
  }
}
