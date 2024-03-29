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

export interface JerseyDetails {
  cut: JerseyCut;
  size: JerseySize;
}

export interface JerseySizes {
  size: JerseySize;
  text: string;
}

export interface JerseyOrder {
  id?: string;
  jerseys?: JerseyDetails [];
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

export const EMPTY_JERSEY_ORDER: JerseyOrder = { jerseys: [{ cut: JerseyCut.Male, size: JerseySize.L }] };
