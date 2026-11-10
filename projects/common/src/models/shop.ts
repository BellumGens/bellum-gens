export enum JerseyCut {
  Male,
  Female
}

export enum JerseySize {
  XS,
  S,
  M,
  L,
  XL,
  XXL,
  XXXL
}

export enum ProductType {
  Jersey,
  Umbrella,
  Pen,
  Pin,
  Bracelet,
  Other
}

export enum Brand {
  BellumGens,
  EBLeague,
  BGEStaraZagora
}

export enum OrderStatus {
  AwaitingPayment,
  Paid,
  Shipped,
  Delivered,
  Cancelled,
  Refunded,
  /** Placed with cash on delivery: nothing is paid online, the courier collects the payment. */
  Confirmed
}

export enum PaymentStatus {
  Pending,
  Authorised,
  Completed,
  Failed,
  Cancelled
}

export enum DeliveryMethod {
  Courier,
  EventPickup
}

/**
 * The delivery methods the storefront offers. Event pickup is left out until the next event is announced;
 * add it back here to offer it again.
 */
export const AVAILABLE_DELIVERY_METHODS: readonly DeliveryMethod[] = [DeliveryMethod.Courier];

export enum PaymentMethod {
  Revolut,
  /** Наложен платеж: paid to the courier on delivery. Courier delivery only. */
  CashOnDelivery
}

export interface ProductVariant {
  id: string;
  productId?: string;
  name: string;
  cut?: JerseyCut | null;
  size?: JerseySize | null;
  sku?: string | null;
  priceOverride?: number | null;
  /** Null when stock is not tracked. */
  stockQuantity?: number | null;
  /**
   * Sent when saving from the admin editor: the stock it loaded. The server applies the change from this value,
   * so units that orders took or released while the editor was open are kept.
   */
  originalStockQuantity?: number | null;
  active: boolean;
  sortOrder: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  type: ProductType;
  brand: Brand;
  price: number;
  discountPercentage?: number | null;
  imageUrl?: string | null;
  galleryUrls: string[];
  /** Null when stock is not tracked (or when the product uses variants). */
  stockQuantity?: number | null;
  /**
   * Sent when saving from the admin editor: the stock it loaded. The server applies the change from this value,
   * so units that orders took or released while the editor was open are kept.
   */
  originalStockQuantity?: number | null;
  active: boolean;
  sortOrder: number;
  createdOn?: string;
  updatedOn?: string;
  variants: ProductVariant[];
}

/** A line in the local cart. The product and variant are kept for display; the API only receives the ids. */
export interface CartItem {
  productId: string;
  variantId?: string;
  quantity: number;
  product: Product;
  variant?: ProductVariant;
}

export interface CartLineRequest {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface QuoteRequest {
  lines: CartLineRequest[];
  promoCode?: string | null;
  deliveryMethod: DeliveryMethod;
}

export interface QuoteLine {
  productId: string;
  variantId?: string | null;
  productName?: string | null;
  variantName?: string | null;
  imageUrl?: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
  available?: number | null;
  /** Set when the line cannot be fulfilled as requested. */
  problem?: string | null;
}

export interface Quote {
  lines: QuoteLine[];
  subtotal: number;
  discountTotal: number;
  shippingCost: number;
  total: number;
  currency: string;
  promoCode?: string | null;
  promoApplied: boolean;
  promoProblem?: string | null;
  freeShipping: boolean;
  isValid: boolean;
}

export interface CustomerDetails {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  /** Required for courier delivery; null for event pickup. */
  city: string | null;
  streetAddress: string | null;
  postalCode?: string | null;
  country: string;
  language: string;
  customerNote?: string | null;
  acceptedTerms: boolean;
}

export type OrderRequest = QuoteRequest & CustomerDetails & {
  paymentMethod: PaymentMethod;
  /** The unpaid order placed earlier from the same cart; the new order replaces it and releases its stock. */
  replacesOrderId?: string | null;
  /** Keep the delivery address in the signed-in customer's address book (or mark a saved one as just used). */
  saveAddress?: boolean;
};

/** The only country the shop delivers to. */
export const DELIVERY_COUNTRY = 'BG';

/** Bulgarian postal codes have four digits. */
export const POSTAL_CODE_PATTERN = /^\d{4}$/;

/** A delivery address a signed-in customer saved to their account. Always in Bulgaria. */
export interface SavedAddress {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  city: string;
  streetAddress: string;
  /** Several Bulgarian towns share a name; the postal code tells them apart. */
  postalCode: string;
  country: string;
  createdOn: string;
  lastUsedOn: string;
}

export type AddressRequest = Pick<SavedAddress, 'firstName' | 'lastName' | 'phoneNumber' | 'city' | 'streetAddress' | 'postalCode'>;

export interface OrderCreated {
  orderId: string;
  orderNumber: string;
  total: number;
  currency: string;
  /** The provider's checkout; null for a cash on delivery order, which has nothing to pay online. */
  checkoutUrl?: string | null;
  paymentToken?: string | null;
  expiresOn: string;
}

export interface OrderItem {
  id?: number;
  orderId?: string;
  productId: string;
  variantId?: string | null;
  productName: string;
  variantName?: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface Payment {
  id: string;
  orderId: string;
  provider: number;
  providerOrderId?: string | null;
  checkoutUrl?: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  createdOn: string;
  updatedOn: string;
  lastEventType?: string | null;
}

/** What the storefront sees about an order. */
export interface OrderStatusView {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus?: PaymentStatus | null;
  items: OrderItem[];
  subtotal: number;
  discountTotal: number;
  shippingCost: number;
  total: number;
  currency: string;
  promoCode?: string | null;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  /** Null for orders picked up at an event. */
  city: string | null;
  streetAddress: string | null;
  postalCode?: string | null;
  country: string;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  orderDate: string;
  paidOn?: string | null;
  shippedOn?: string | null;
  expiresOn: string;
  trackingNumber?: string | null;
  checkoutUrl?: string | null;
  canRetryPayment: boolean;
}

/** The full order entity, as returned to admins. */
export interface ShopOrder {
  id: string;
  orderSequence: number;
  orderNumber: string;
  userId?: string | null;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  /** Null for orders picked up at an event. */
  city: string | null;
  streetAddress: string | null;
  postalCode?: string | null;
  country: string;
  language: string;
  promoCode?: string | null;
  deliveryMethod: DeliveryMethod;
  subtotal: number;
  discountTotal: number;
  shippingCost: number;
  total: number;
  currency: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  customerNote?: string | null;
  adminNote?: string | null;
  trackingNumber?: string | null;
  orderDate: string;
  paidOn?: string | null;
  shippedOn?: string | null;
  expiresOn: string;
  items: OrderItem[];
  payments: Payment[];
}

export interface OrderStatusUpdate {
  status: OrderStatus;
  trackingNumber?: string | null;
  note?: string | null;
}

export interface Promo {
  code: string;
  /** Fraction, e.g. 0.1 for 10% off. */
  discount: number;
  expiration?: string | null;
  active: boolean;
  usageLimit?: number | null;
  timesUsed: number;
  minimumOrderTotal?: number | null;
  brand?: Brand | null;
}

export interface PromoView {
  code: string;
  discount: number;
  expiration?: string | null;
  minimumOrderTotal?: number | null;
  brand?: Brand | null;
}

export interface WebhookRegistration {
  id: string;
  url: string;
  events: string[];
  signingSecret: string;
}

export const BRAND_NAMES: Record<Brand, string> = {
  [Brand.BellumGens]: 'Bellum Gens',
  [Brand.EBLeague]: 'Esports Business League',
  [Brand.BGEStaraZagora]: 'BGE Stara Zagora'
};

export const PRODUCT_TYPE_NAMES: Record<ProductType, string> = {
  [ProductType.Jersey]: $localize`:@@shopTypeJersey:Jersey`,
  [ProductType.Umbrella]: $localize`:@@shopTypeUmbrella:Umbrella`,
  [ProductType.Pen]: $localize`:@@shopTypePen:Pen`,
  [ProductType.Pin]: $localize`:@@shopTypePin:Pin`,
  [ProductType.Bracelet]: $localize`:@@shopTypeBracelet:Bracelet`,
  [ProductType.Other]: $localize`:@@shopTypeOther:Other`
};

export const ORDER_STATUS_NAMES: Record<OrderStatus, string> = {
  [OrderStatus.AwaitingPayment]: $localize`:@@shopStatusAwaitingPayment:Awaiting payment`,
  [OrderStatus.Paid]: $localize`:@@shopStatusPaid:Paid`,
  [OrderStatus.Shipped]: $localize`:@@shopStatusShipped:Shipped`,
  [OrderStatus.Delivered]: $localize`:@@shopStatusDelivered:Delivered`,
  [OrderStatus.Cancelled]: $localize`:@@shopStatusCancelled:Cancelled`,
  [OrderStatus.Refunded]: $localize`:@@shopStatusRefunded:Refunded`,
  [OrderStatus.Confirmed]: $localize`:@@shopStatusConfirmed:Confirmed`
};

/** The Material icon shown next to an order in each status. */
export const ORDER_STATUS_ICONS: Record<OrderStatus, string> = {
  [OrderStatus.AwaitingPayment]: 'hourglass_top',
  [OrderStatus.Paid]: 'check_circle',
  [OrderStatus.Shipped]: 'local_shipping',
  [OrderStatus.Delivered]: 'inventory_2',
  [OrderStatus.Cancelled]: 'cancel',
  [OrderStatus.Refunded]: 'undo',
  [OrderStatus.Confirmed]: 'check_circle'
};

export const DELIVERY_METHOD_NAMES: Record<DeliveryMethod, string> = {
  [DeliveryMethod.Courier]: $localize`:@@shopDeliveryCourier:Courier delivery`,
  [DeliveryMethod.EventPickup]: $localize`:@@shopDeliveryPickup:Pick up at an event`
};

export const PAYMENT_METHOD_NAMES: Record<PaymentMethod, string> = {
  [PaymentMethod.Revolut]: $localize`:@@shopPaymentOnline:Pay online by card`,
  [PaymentMethod.CashOnDelivery]: $localize`:@@shopPaymentCashOnDelivery:Cash on delivery`
};

export const JERSEY_CUT_NAMES: Record<JerseyCut, string> = {
  [JerseyCut.Male]: $localize`:@@shopCutMale:Male`,
  [JerseyCut.Female]: $localize`:@@shopCutFemale:Female`
};

export const JERSEY_SIZE_NAMES: Record<JerseySize, string> = {
  [JerseySize.XS]: 'XS',
  [JerseySize.S]: 'S',
  [JerseySize.M]: 'M',
  [JerseySize.L]: 'L',
  [JerseySize.XL]: 'XL',
  [JerseySize.XXL]: 'XXL',
  [JerseySize.XXXL]: 'XXXL'
};

/** Unit price after the product discount, matching the server rounding. */
export const effectivePrice = (product: Product, variant?: ProductVariant | null): number => {
  let price = variant?.priceOverride ?? product.price;
  if (product.discountPercentage && product.discountPercentage > 0) {
    price = price * (1 - product.discountPercentage / 100);
  }
  return Math.round(price * 100) / 100;
};

export const variantStock = (product: Product, variant?: ProductVariant | null): number | null | undefined =>
  variant ? variant.stockQuantity : product.stockQuantity;

export const isSoldOut = (product: Product, variant?: ProductVariant | null): boolean => {
  if (variant) {
    return variant.stockQuantity !== null && variant.stockQuantity !== undefined && variant.stockQuantity <= 0;
  }
  if (product.variants?.length) {
    return product.variants.every(v => !v.active || (v.stockQuantity !== null && v.stockQuantity !== undefined && v.stockQuantity <= 0));
  }
  return product.stockQuantity !== null && product.stockQuantity !== undefined && product.stockQuantity <= 0;
};
