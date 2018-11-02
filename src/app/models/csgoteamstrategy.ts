export interface TeamStrategy {
  Id: string;
  TeamId: string;
  Side: Side;
  Title: string;
  Description: string;
  Url: string;
}

export enum Side {
  TSide,
  CTSide
}
