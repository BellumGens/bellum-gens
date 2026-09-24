import { Injectable, PLATFORM_ID, computed, effect, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { catchError, debounceTime, switchMap, tap } from 'rxjs/operators';
import { ApiShopService } from './bellumgens-api.shop.service';
import { CommunicationService } from './communication.service';
import { CartItem, CartLineRequest, DeliveryMethod, Product, ProductVariant, Quote, QuoteRequest } from '../models/shop';

interface StoredCart {
  items: CartItem[];
  promoCode: string | null;
  deliveryMethod: DeliveryMethod;
}

/**
 * The shopping cart. Lives in memory, mirrored to localStorage in the browser, and re-priced by the API
 * whenever its contents change so the totals shown are always the server's.
 */
@Injectable({
  providedIn: 'root'
})
export class CartService {
  public static readonly storageKey = 'bg-shop-cart';

  private platformId = inject(PLATFORM_ID);
  private shopApi = inject(ApiShopService);
  private commService = inject(CommunicationService);
  private isBrowser = isPlatformBrowser(this.platformId);

  public readonly items = signal<CartItem[]>([]);
  public readonly promoCode = signal<string | null>(null);
  public readonly deliveryMethod = signal<DeliveryMethod>(DeliveryMethod.Courier);

  /** Latest server quote for the cart, null while empty or before the first response. */
  public readonly quote = signal<Quote | null>(null);
  public readonly quoting = signal(false);

  public readonly count = computed(() => this.items().reduce((sum, item) => sum + item.quantity, 0));
  public readonly isEmpty = computed(() => this.items().length === 0);

  public readonly request = computed<QuoteRequest>(() => ({
    lines: this.lines(),
    promoCode: this.promoCode(),
    deliveryMethod: this.deliveryMethod()
  }));

  private request$ = toObservable(this.request);

  constructor() {
    this.restore();

    effect(() => {
      const snapshot: StoredCart = { items: this.items(), promoCode: this.promoCode(), deliveryMethod: this.deliveryMethod() };
      this.persist(snapshot);
    });

    if (this.isBrowser) {
      this.request$.pipe(
        tap(request => this.quoting.set(request.lines.length > 0)),
        debounceTime(250),
        switchMap(request => request.lines.length
          ? this.shopApi.quote(request).pipe(catchError(() => of(null)))
          : of(null)),
        takeUntilDestroyed()
      ).subscribe(quote => {
        this.quote.set(quote);
        this.quoting.set(false);
      });
    }
  }

  public lines(): CartLineRequest[] {
    return this.items().map(item => ({ productId: item.productId, variantId: item.variantId, quantity: item.quantity }));
  }

  public add(product: Product, variant?: ProductVariant | null, quantity = 1) {
    if (quantity < 1) {
      return;
    }
    const variantId = variant?.id;
    this.items.update(items => {
      const existing = items.find(i => i.productId === product.id && i.variantId === variantId);
      if (existing) {
        return items.map(i => i === existing ? { ...i, quantity: i.quantity + quantity, product, variant: variant ?? undefined } : i);
      }
      return [...items, { productId: product.id, variantId, quantity, product, variant: variant ?? undefined }];
    });
    const label = variant ? `${product.name} (${variant.name})` : product.name;
    this.commService.emitSuccess($localize`:@@shopAddedToCart:${label}:name: added to your cart`);
  }

  public setQuantity(item: CartItem, quantity: number) {
    if (quantity < 1) {
      this.remove(item);
      return;
    }
    this.items.update(items => items.map(i => this.same(i, item) ? { ...i, quantity } : i));
  }

  public remove(item: CartItem) {
    this.items.update(items => items.filter(i => !this.same(i, item)));
  }

  public clear() {
    this.items.set([]);
    this.promoCode.set(null);
    this.quote.set(null);
  }

  public setPromoCode(code: string | null) {
    const normalized = code?.trim().toUpperCase() || null;
    this.promoCode.set(normalized);
  }

  public setDeliveryMethod(method: DeliveryMethod) {
    this.deliveryMethod.set(method);
  }

  /** Asks the API for fresh prices right away, e.g. after a rejected checkout. */
  public refresh() {
    if (!this.isBrowser || this.items().length === 0) {
      return;
    }
    this.quoting.set(true);
    this.shopApi.quote(this.request()).pipe(catchError(() => of(null))).subscribe(quote => {
      this.quote.set(quote);
      this.quoting.set(false);
    });
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
        this.items.set(stored.items.filter(i => i?.productId && i.product && i.quantity > 0));
      }
      this.promoCode.set(stored.promoCode ?? null);
      if (stored.deliveryMethod === DeliveryMethod.EventPickup) {
        this.deliveryMethod.set(DeliveryMethod.EventPickup);
      }
    } catch {
      window.localStorage.removeItem(CartService.storageKey);
    }
  }

  private persist(snapshot: StoredCart) {
    if (!this.isBrowser) {
      return;
    }
    try {
      if (snapshot.items.length === 0 && !snapshot.promoCode) {
        window.localStorage.removeItem(CartService.storageKey);
      } else {
        window.localStorage.setItem(CartService.storageKey, JSON.stringify(snapshot));
      }
    } catch {
      // Storage may be full or blocked; the in-memory cart still works.
    }
  }
}
