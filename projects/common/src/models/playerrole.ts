import { TeamMember } from './csgoteam';

export interface Role {
  id: PlaystyleRole;
  name: string;
}
export interface RoleSlot {
  roleName: string;
  role: PlaystyleRole;
  user: TeamMember | null;
}

/** The roles of a team roster. Counter-Strike and Dota 2 rosters each have their own five roles. */
export enum PlaystyleRole {
  NotSet,
  // Counter-Strike
  IGL,
  Awper,
  EntryFragger,
  Support,
  Lurker,
  // Dota 2 positions 1 to 5
  Carry,
  Mid,
  Offlane,
  SoftSupport,
  HardSupport
}

export const ALL_ROLES: Role [] = [{
    id: PlaystyleRole.NotSet,
    name: '---'
  }, {
    id: PlaystyleRole.IGL,
    name: 'IGL'
  }, {
    id: PlaystyleRole.Awper,
    name: 'Awper'
  }, {
    id: PlaystyleRole.EntryFragger,
    name: 'Entry'
  }, {
    id: PlaystyleRole.Support,
    name: 'Support'
  }, {
    id: PlaystyleRole.Lurker,
    name: 'Lurker'
  }
];
