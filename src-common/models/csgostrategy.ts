import { CSGOMap } from './csgomaps';

export interface CSGOStrategy {
  id: string;
  teamId: string;
  side: Side;
  title: string;
  description: string;
  url: string;
  map: CSGOMap;
  lastUpdated?: Date;
  owner?: string;
  image?: string;
  editorMetadata?: string;
  votes?: StrategyVote [];
  userId?: string;
  customUrl?: string;
  visible?: boolean;
  comments?: StrategyComment [];
}

export interface StrategyVote {
  vote: VoteDirection;
  userId: string;
}

export interface StrategyComment {
  id?: string;
  stratId: string;
  comment: string;
  published?: Date;
  userId: string;
  userName?: string;
  userAvatar?: string;
  _inEdit?: boolean;
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
    id: '',
    teamId: '',
    side: Side.TSide,
    title: '',
    description: '',
    url: '',
    visible: visible,
    map: CSGOMap.Dust2
  };
}

export function newEmptyComment(userId: string = null, stratId: string = null): StrategyComment {
  return {
    userId: userId,
    stratId: stratId,
    comment: null
  };
}
