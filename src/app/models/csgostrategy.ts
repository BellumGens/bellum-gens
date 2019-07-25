import { CSGOMap } from './csgomaps';

export interface CSGOStrategy {
  Id: string;
  TeamId: string;
  Side: Side;
  Title: string;
  Description: string;
  Url: string;
  Map: CSGOMap;
  LastUpdated?: Date;
  Owner?: string;
  Image?: string;
  EditorMetadata?: string;
  Votes?: StrategyVote [];
  UserId?: string;
  CustomUrl?: string;
  Visible?: boolean;
  Comments?: StrategyComment [];
}

export interface StrategyVote {
  Vote: VoteDirection;
  UserId: string;
}

export interface StrategyComment {
  Comment: string;
  Published: Date;
}

export enum Side {
  TSide,
  CTSide
}

export enum VoteDirection {
  Up,
  Down
}

export function newEmptyStrategy(visible = false): CSGOStrategy {
  return {
    Id: '',
    TeamId: '',
    Side: Side.TSide,
    Title: '',
    Description: '',
    Url: '',
    Visible: visible,
    Map: CSGOMap.Dust2
  };
}
