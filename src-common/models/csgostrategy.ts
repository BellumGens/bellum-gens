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
  stratImage?: string;
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

export const NEW_EMPTY_STRAT: CSGOStrategy = {
  id: '00000000-0000-0000-0000-000000000000',
  teamId: null,
  side: Side.TSide,
  title: '',
  description: '',
  url: '',
  visible: false,
  map: CSGOMap.Dust2
};

export const NEW_EMPTY_COMMENT: StrategyComment = {
  userId: null,
  stratId: null,
  comment: null
};
