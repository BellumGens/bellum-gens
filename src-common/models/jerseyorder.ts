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
  allSizes: JerseySizes [];
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
    jerseys: [{ cut: JerseyCut.Male, size: JerseySize.L, allSizes: [
      { text: 'XS', size: JerseySize.XS, disabled: false },
      { text: 'S', size: JerseySize.S, disabled: false },
      { text: 'M', size: JerseySize.M, disabled: false },
      { text: 'L', size: JerseySize.L, disabled: false },
      { text: 'XL', size: JerseySize.XL, disabled: false },
      { text: 'XXL', size: JerseySize.XXL, disabled: false },
      { text: 'XXXL', size: JerseySize.XXXL, disabled: false }
    ] }]
  };
}

export function newEmptyJerseyDetails(): JerseyDetails {
  return { cut: JerseyCut.Male, size: JerseySize.L, allSizes: [
    { text: 'XS', size: JerseySize.XS, disabled: false },
    { text: 'S', size: JerseySize.S, disabled: false },
    { text: 'M', size: JerseySize.M, disabled: false },
    { text: 'L', size: JerseySize.L, disabled: false },
    { text: 'XL', size: JerseySize.XL, disabled: false },
    { text: 'XXL', size: JerseySize.XXL, disabled: false },
    { text: 'XXXL', size: JerseySize.XXXL, disabled: false }
  ] };
}
