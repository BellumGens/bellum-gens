export interface SteamUser {
  steamID64: string;
  steamID: string;
  avatarIcon: string;
  avatarMedium: string;
  avatarFull: string;
  realname: string;
  location: string;
  country: string;
  summary: string;
  customURL: string;
  groups: SteamGroup [];
}

export interface SteamGroup {
  isPrimary: boolean;
  groupID64: string;
  groupName: string;
  avatarIcon: string;
  avatarMedium: string;
  avatarFull: string;
  members: string [];
}
