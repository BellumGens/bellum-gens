import { CSGOTeam } from './csgoteam';
import { ApplicationUser } from './applicationuser';
import { CSGOMap } from './csgomaps';

export interface Tournament {
  ID?: string;
  Name: string;
  StartDate?: Date;
  EndDate?: Date;
}

export interface TournamentApplication {
  Id?: string;
  UserId?: string;
  CompanyId?: string;
  Game: Game;
  TeamId?: string;
  Email: string;
  BattleNetId?: string;
  Hash?: string;
  DateSubmitted?: Date;
  State?: TournamentApplicationState;
}

export interface TournamentRegistration {
  Id: string;
  UserId: string;
  State: TournamentApplicationState;
  User: ApplicationUser;
  Team: CSGOTeam;
  BattleTag: string;
  TournamentCSGOGroupId: string;
  TournamentSC2GroupId: string;
}

export interface TournamentGroup {
  Id?: string;
  Name: string;
  TournamentId?: string;
  Participants?: TournamentRegistration [];
  Matches?: any [];
  inEdit?: boolean;
}

export interface TournamentMatch {
  Id?: string;
  DemoLink?: string;
  VideoLink?: string;
  StartTime?: Date;
  EndTime?: Date;
}

export interface TournamentCSGOMatch extends TournamentMatch {
  TeamId1?: string;
  TeamId2?: string;
  Maps?: CSGOMap [];
  Team1?: CSGOTeam;
  Team2?: CSGOTeam;
}

export interface TournamentCSGOGroup extends TournamentGroup {
  Matches?: any [];
}

export interface TournamentSC2Group extends TournamentGroup {
  Matches?: any [];
}

export interface Company {
  Name: string;
  Website: string;
}

export interface RegistrationsCount {
  game: Game;
  count: number;
}

export enum Game {
  CSGO,
  StarCraft2
}

export enum TournamentApplicationState {
  Pending,
  Confirmed
}

export function getEmptyNewApplication(): TournamentApplication {
  return {
    Game: null,
    Email: ''
  };
}

export function getEmptyNewTournament(): Tournament {
  return { Name: null };
}

export function getEmptyNewCSGOGroup(): TournamentCSGOGroup {
  return { Name: null, inEdit: false };
}

export function getEmptyNewSC2Group(): TournamentCSGOGroup {
  return { Name: null, inEdit: false };
}

export const GAMES = [
  { name: 'Counter Strike: Global Offensive', id: Game.CSGO },
  { name: 'StarCraft II', id: Game.StarCraft2 }
];

export const WEEKLY_SCHEDULE = [
  { name: 'Седмица 1', start: new Date(2020, 1, 27), end: new Date(2020, 1, 31), matches: [
    { start: new Date(2020, 1, 27, 19, 30, 0), match: null },
    { start: new Date(2020, 1, 27, 21, 30, 0), match: null }
  ] },
  { name: 'Седмица 2', start: new Date(2020, 2, 3), end: new Date(2020, 2, 7), matches: [
    { start: new Date(2020, 2, 3, 19, 30, 0), match: null },
    { start: new Date(2020, 2, 3, 21, 30, 0), match: null }
  ] }
];
