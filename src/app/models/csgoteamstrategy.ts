import { CSGOMap } from './csgomaps';

export interface TeamStrategy {
  Id: string;
  TeamId: string;
  Side: Side;
  Title: string;
  Description: string;
  Url: string;
  Image?: string;
  EditorMetadata?: string;
  Map: CSGOMap;
}

export enum Side {
  TSide,
  CTSide
}

export function newEmptyStrategy(): TeamStrategy {
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
