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
  Id?: string;
  StratId?: string;
  Comment: string;
  Published?: Date;
  UserId: string;
  UserName?: string;
  UserAvatar?: string;
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

export function newEmptyComment(): StrategyComment {
  return {
    UserId: null,
    Comment: null
  };
}
