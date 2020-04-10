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

export interface JerseyOrder {
  jerseys?: JerseyDetails [];
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  city?: string;
  streetAddress?: string;
}

export function newEmptyJerseyOrder(): JerseyOrder {
  return {
    jerseys: [{ cut: JerseyCut.Male, size: JerseySize.L }]
  };
}
