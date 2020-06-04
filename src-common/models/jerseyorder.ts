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
  disabled: boolean;
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
  promocode?: string;
  orderDate?: Date;
  confirmed?: boolean;
  shipped?: boolean;
}

export interface Promo {
  code: string;
  discount: number;
}

export function newEmptyJerseyOrder(): JerseyOrder {
  return {
    jerseys: [{ cut: JerseyCut.Male, size: JerseySize.L }]
  };
}
