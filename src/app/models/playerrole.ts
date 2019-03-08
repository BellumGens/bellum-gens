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

export const ALL_ROLES: Role [] = [{
    Id: PlaystyleRole.NotSet,
    Name: '---'
  }, {
    Id: PlaystyleRole.IGL,
    Name: 'IGL'
  }, {
    Id: PlaystyleRole.Awper,
    Name: 'Awper'
  }, {
    Id: PlaystyleRole.EntryFragger,
    Name: 'Entry Fragger'
  }, {
    Id: PlaystyleRole.Support,
    Name: 'Support'
  }, {
    Id: PlaystyleRole.Lurker,
    Name: 'Lurker'
  }
];
