import { TeamMember } from './csgoteam';

export interface Role {
  id: PlaystyleRole;
  name: string;
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
