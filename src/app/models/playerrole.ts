export interface Role {
  Id: PlaystyleRole;
  Name: string;
}

export enum PlaystyleRole {
  NotSet,
  IGL,
  Awper,
  EntryFragger,
  Support,
  Lurker
}
