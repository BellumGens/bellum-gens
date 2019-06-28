import { CSGOMap } from './csgomaps';

export interface CSGOStrategy {
  Id: string;
  TeamId: string;
  Side: Side;
  Title: string;
  Description: string;
  Url: string;
  Image?: string;
  EditorMetadata?: string;
  Map: CSGOMap;
  UserId?: string;
  CustomUrl?: string;
  Visible?: boolean;
}

export enum Side {
  TSide,
  CTSide
}

export function newEmptyStrategy(): CSGOStrategy {
  return {
    Id: '',
    TeamId: '',
    Side: Side.TSide,
    Title: '',
    Description: '',
    Url: '',
    Map: CSGOMap.Dust2
  };
}
