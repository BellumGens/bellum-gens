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
  Refunded
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
  city: string;
  streetAddress: string;
  postalCode?: string | null;
  country: string;
  language: string;
  customerNote?: string | null;
  acceptedTerms: boolean;
}

export type OrderRequest = QuoteRequest & CustomerDetails;

export interface OrderCreated {
  orderId: string;
  orderNumber: string;
  total: number;
  currency: string;
  checkoutUrl: string;
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
  city: string;
  streetAddress: string;
  postalCode?: string | null;
  country: string;
  deliveryMethod: DeliveryMethod;
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
  city: string;
  streetAddress: string;
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
  paymentMethod: number;
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
  [OrderStatus.Refunded]: $localize`:@@shopStatusRefunded:Refunded`
};

export const DELIVERY_METHOD_NAMES: Record<DeliveryMethod, string> = {
  [DeliveryMethod.Courier]: $localize`:@@shopDeliveryCourier:Courier delivery`,
  [DeliveryMethod.EventPickup]: $localize`:@@shopDeliveryPickup:Pick up at an event`
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
