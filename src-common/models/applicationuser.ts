export interface AdminAppUserSummary {
  Id: string;
  AvatarMedium: string;
  UserName: string;
  Roles: [];
}

export interface AppUserSummary {
  id: string;
  steamId: string;
  username: string;
  avatarMedium: string;
  customURL: string;
  battleNetId: string;
}

export interface ApplicationUser extends AppUserSummary {
  avatarIcon: string;
  avatarFull: string;
  realname: string;
  email: string;
  searchVisible: boolean;
  externalLogins: string [];
}

export interface UserPreferences {
  searchVisible: boolean;
}
