import { TeamMember } from './csgoteam';

export interface Role {
  Id: PlaystyleRole;
  Name: string;
}
export interface RoleSlot {
  roleName: string;
  role: PlaystyleRole;
  user: TeamMember;
}

export enum PlaystyleRole {
  NotSet,
  IGL,
  Awper,
  EntryFragger,
  Support,
  Lurker
}
