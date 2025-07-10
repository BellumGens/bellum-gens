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
  Bracelet
}

export interface ProductOrderDetails {
  cut?: JerseyCut;
  size?: JerseySize;
  product: Product;
}

export interface JerseySizes {
  size: JerseySize;
  text: string;
}

export interface Product {
  id: string;
  productName: string;
  productType: ProductType;
  description: string;
  price: number;
  discountPercentage?: number;
  imageUrl: string;
  quantity: number;
}

export interface Order {
  id?: string;
  orderProducts?: ProductOrderDetails [];
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  city?: string;
  streetAddress?: string;
  promoCode?: string;
  orderDate?: Date;
  confirmed?: boolean;
  shipped?: boolean;
}

export interface Promo {
  code: string;
  discount: number;
  expiration: Date;
}

export const EMPTY_JERSEY_ORDER: Order = { orderProducts: [{ cut: JerseyCut.Male, size: JerseySize.L } as ProductOrderDetails] };
