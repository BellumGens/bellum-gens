/**
 * A fake storefront API for the shop E2E tests.
 *
 * The shop talks to api.bellumgens.com (or the local API in development). The tests answer those requests with
 * cy.intercept() so they never touch real products, stock or orders, and so prices are predictable.
 *
 * The app's own models (projects/common/src/models/shop.ts) call $localize when they load, which does not exist in
 * the Cypress bundle, so the enum values the API uses are repeated here as plain numbers.
 */

/** Brand, ProductType, DeliveryMethod, PaymentMethod, OrderStatus and PaymentStatus, as the API sends them. */
export const Brand = { BellumGens: 0, EBLeague: 1, BGEStaraZagora: 2 } as const;
export const ProductType = { Jersey: 0, Umbrella: 1, Pen: 2 } as const;
export const JerseyCut = { Male: 0, Female: 1 } as const;
export const JerseySize = { S: 1, M: 2, L: 3 } as const;
export const DeliveryMethod = { Courier: 0 } as const;
export const PaymentMethod = { Revolut: 0, CashOnDelivery: 1 } as const;
export const OrderStatus = { AwaitingPayment: 0, Paid: 1, Shipped: 2, Cancelled: 4, Confirmed: 6 } as const;
export const PaymentStatus = { Pending: 0, Completed: 2, Failed: 3 } as const;

/**
 * The path English pages are served under. The SSR server redirects pages without a locale (/shop/...) to the
 * browser's language, so the tests use the English prefix directly to stay independent of the browser locale.
 */
export const EN = '/en';

/** The key the cart service stores the cart under (CartService.storageKey). */
export const CART_STORAGE_KEY = 'bg-shop-cart';

export interface FakeVariant {
  id: string;
  productId: string;
  name: string;
  cut: number | null;
  size: number | null;
  sku: string | null;
  priceOverride: number | null;
  stockQuantity: number | null;
  active: boolean;
  sortOrder: number;
}

export interface FakeProduct {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  type: number;
  brand: number;
  price: number;
  discountPercentage: number | null;
  imageUrl: string | null;
  galleryUrls: string[];
  stockQuantity: number | null;
  active: boolean;
  sortOrder: number;
  variants: FakeVariant[];
}

interface CartLine {
  productId: string;
  variantId?: string | null;
  quantity: number;
}

export interface QuoteRequestBody {
  lines: CartLine[];
  promoCode?: string | null;
  deliveryMethod: number;
}

const jerseyVariant = (id: string, cut: number, size: number, name: string, stockQuantity: number | null, sortOrder: number): FakeVariant => ({
  id,
  productId: 'p-jersey',
  name,
  cut,
  size,
  sku: null,
  priceOverride: null,
  stockQuantity,
  active: true,
  sortOrder
});

/** A jersey with cut and size options, one of them sold out and one nearly so. */
export const jersey: FakeProduct = {
  id: 'p-jersey',
  name: 'Bellum Gens Jersey 2026',
  slug: 'bellum-gens-jersey-2026',
  description: 'The official Bellum Gens team jersey.',
  type: ProductType.Jersey,
  brand: Brand.BellumGens,
  price: 50,
  discountPercentage: null,
  imageUrl: null,
  galleryUrls: [],
  stockQuantity: null,
  active: true,
  sortOrder: 0,
  variants: [
    jerseyVariant('v-male-m', JerseyCut.Male, JerseySize.M, 'Male / M', 10, 0),
    jerseyVariant('v-male-l', JerseyCut.Male, JerseySize.L, 'Male / L', 0, 1),
    jerseyVariant('v-female-s', JerseyCut.Female, JerseySize.S, 'Female / S', 3, 2)
  ]
};

/** A discounted product without options and without stock tracking: €20 at 10% off is €18. */
export const umbrella: FakeProduct = {
  id: 'p-umbrella',
  name: 'EB League Umbrella',
  slug: 'eb-league-umbrella',
  description: null,
  type: ProductType.Umbrella,
  brand: Brand.EBLeague,
  price: 20,
  discountPercentage: 10,
  imageUrl: null,
  galleryUrls: [],
  stockQuantity: null,
  active: true,
  sortOrder: 1,
  variants: []
};

/** A sold out product. */
export const pen: FakeProduct = {
  id: 'p-pen',
  name: 'BGE Stara Zagora Pen',
  slug: 'bge-stara-zagora-pen',
  description: null,
  type: ProductType.Pen,
  brand: Brand.BGEStaraZagora,
  price: 3,
  discountPercentage: null,
  imageUrl: null,
  galleryUrls: [],
  stockQuantity: 0,
  active: true,
  sortOrder: 2,
  variants: []
};

export const products = [jersey, umbrella, pen];

/** Promo codes the fake API accepts, with the fraction they take off. */
export const promos: Record<string, number> = { SAVE10: 0.1 };

/** Orders below this total (after the discount) pay for shipping. */
export const FREE_SHIPPING_FROM = 60;
export const SHIPPING_COST = 5;

const round = (value: number) => Math.round(value * 100) / 100;

const unitPrice = (product: FakeProduct, variant?: FakeVariant) => {
  const price = variant?.priceOverride ?? product.price;
  return round(product.discountPercentage ? price * (1 - product.discountPercentage / 100) : price);
};

/** Prices a cart the way the API does: line prices, stock problems, the promo code and shipping. */
export const quoteFor = (request: QuoteRequestBody) => {
  const lines = request.lines.map(line => {
    const product = products.find(p => p.id === line.productId);
    if (!product) {
      throw new Error(`The fake shop API has no product ${line.productId}`);
    }
    const variant = product.variants.find(v => v.id === line.variantId);
    const available = variant ? variant.stockQuantity : product.stockQuantity;
    const price = unitPrice(product, variant);
    return {
      productId: product.id,
      variantId: variant?.id ?? null,
      productName: product.name,
      variantName: variant?.name ?? null,
      imageUrl: null,
      unitPrice: price,
      quantity: line.quantity,
      lineTotal: round(price * line.quantity),
      available,
      problem: available !== null && line.quantity > available ? `Only ${available} left in stock.` : null
    };
  });
  const subtotal = round(lines.reduce((sum, line) => sum + line.lineTotal, 0));
  const promoCode = request.promoCode ?? null;
  const discount = promoCode ? promos[promoCode] : undefined;
  const discountTotal = discount ? round(subtotal * discount) : 0;
  const shippingCost = subtotal - discountTotal >= FREE_SHIPPING_FROM ? 0 : SHIPPING_COST;
  return {
    lines,
    subtotal,
    discountTotal,
    shippingCost,
    total: round(subtotal - discountTotal + shippingCost),
    currency: 'EUR',
    promoCode,
    promoApplied: !!discount,
    promoProblem: promoCode && !discount ? 'This promo code is not valid.' : null,
    freeShipping: shippingCost === 0,
    isValid: lines.every(line => !line.problem)
  };
};

/** The order page's view of an order placed with the given cart lines. */
export const orderView = (id: string, status: number, lines: CartLine[], overrides: Record<string, unknown> = {}) => {
  const quote = quoteFor({ lines, deliveryMethod: DeliveryMethod.Courier });
  return {
    id,
    orderNumber: 'BG-1001',
    status,
    paymentStatus: null,
    items: quote.lines.map((line, i) => ({
      id: i + 1,
      orderId: id,
      productId: line.productId,
      variantId: line.variantId,
      productName: line.productName,
      variantName: line.variantName,
      unitPrice: line.unitPrice,
      quantity: line.quantity,
      lineTotal: line.lineTotal
    })),
    subtotal: quote.subtotal,
    discountTotal: quote.discountTotal,
    shippingCost: quote.shippingCost,
    total: quote.total,
    currency: 'EUR',
    promoCode: null,
    email: 'ivan.petrov@example.com',
    firstName: 'Ivan',
    lastName: 'Petrov',
    phoneNumber: '+359 888 123 456',
    city: 'Sofia',
    streetAddress: '1 Vitosha Blvd',
    postalCode: '1000',
    country: 'BG',
    deliveryMethod: DeliveryMethod.Courier,
    paymentMethod: PaymentMethod.Revolut,
    orderDate: '2026-11-09T10:00:00Z',
    paidOn: null,
    shippedOn: null,
    expiresOn: '2026-11-09T11:00:00Z',
    trackingNumber: null,
    checkoutUrl: null,
    canRetryPayment: false,
    ...overrides
  };
};

/** A cart line as the cart service keeps it in localStorage. */
export const cartItem = (product: FakeProduct, quantity: number, variantId?: string) => ({
  productId: product.id,
  variantId,
  quantity,
  product,
  variant: product.variants.find(v => v.id === variantId)
});

type StoredCartItem = ReturnType<typeof cartItem>;

/** The shop API, matched on any host so the tests run against both the production API URL and the local one. */
export const shopApi = {
  products: /\/api\/shop\/products(\?.*)?$/,
  product: /\/api\/shop\/products\/[^/?]+$/,
  quote: /\/api\/shop\/quote$/,
  orders: /\/api\/shop\/orders$/,
  order: /\/api\/shop\/orders\/[^/?]+$/,
  any: /\/api\/shop\//,
  /** The logged in user check (LoginService.applicationUser), which the checkout reads to prefill the email. */
  account: /\/api\/account$/
};

/**
 * Stubs the read side of the shop API: the catalog, single products and quotes. Tests stub placing and reading
 * orders themselves, since that is what they are about. Aliases: @products, @product, @quote.
 */
export const stubShopApi = () => {
  // The API is on another origin, so POSTs with a JSON body are preflighted. Answer the preflight here so the
  // stubbed request goes ahead without depending on the real server's CORS policy.
  cy.intercept({ method: 'OPTIONS', url: shopApi.any }, req => {
    req.reply({
      statusCode: 204,
      headers: {
        'access-control-allow-origin': req.headers['origin'] as string,
        'access-control-allow-credentials': 'true',
        'access-control-allow-methods': 'GET, POST, PUT, DELETE',
        'access-control-allow-headers': (req.headers['access-control-request-headers'] as string | undefined) ?? 'content-type'
      }
    });
  });
  // Nobody is logged in.
  cy.intercept({ method: 'GET', url: shopApi.account }, { statusCode: 204 }).as('account');
  cy.intercept({ method: 'GET', url: shopApi.products }, { body: products }).as('products');
  cy.intercept({ method: 'GET', url: shopApi.product }, req => {
    const slug = decodeURIComponent(new URL(req.url).pathname.split('/').pop() ?? '');
    const product = products.find(p => p.slug === slug);
    req.reply(product ? { body: product } : { statusCode: 404, body: 'Not found' });
  }).as('product');
  cy.intercept({ method: 'POST', url: shopApi.quote }, req => {
    req.reply({ body: quoteFor(req.body as QuoteRequestBody) });
  }).as('quote');
};

/**
 * The production build registers a service worker that caches the catalog and serves the app shell. Keep it out of
 * the tests so every request reaches the stubs: drop any worker left by earlier specs, and hide the API from each
 * page this test loads (including full page loads the app starts itself, such as the return from the payment page).
 */
export const disableServiceWorker = () => {
  cy.wrap(null, { log: false }).then(async () => {
    const registrations = await window.navigator.serviceWorker?.getRegistrations() ?? [];
    await Promise.all(registrations.map(registration => registration.unregister()));
  });
  cy.on('window:before:load', (win: Window) => {
    delete (Object.getPrototypeOf(win.navigator) as { serviceWorker?: unknown }).serviceWorker;
  });
};

/** Visits a shop page with the given items already in the cart. */
export const visitWithCart = (path: string, items: StoredCartItem[], promoCode: string | null = null) => {
  cy.visit(path, {
    onBeforeLoad: win => {
      win.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({ items, promoCode, deliveryMethod: DeliveryMethod.Courier }));
    }
  });
};

/** The details a customer types at checkout. */
export const customer = {
  firstName: 'Ivan',
  lastName: 'Petrov',
  email: 'ivan.petrov@example.com',
  phoneNumber: '+359 888 123 456',
  city: 'Sofia',
  postalCode: '1000',
  streetAddress: '1 Vitosha Blvd'
};

/** Fills in the checkout form and accepts the terms of sale. */
export const fillCheckoutForm = () => {
  for (const [field, value] of Object.entries(customer)) {
    // The phone field starts with the country code.
    cy.get(`input#${field}`).clear().type(value);
  }
  // Click the box itself: the label holds a link to the terms, which opens in a new tab.
  cy.get('igx-checkbox.terms .igx-checkbox__composite').click();
  cy.get('igx-checkbox.terms input[type="checkbox"]').should('be.checked');
};
