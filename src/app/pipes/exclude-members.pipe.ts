import { Pipe, PipeTransform } from '@angular/core';
import { SteamUserSummary } from '../models/steamuser';
import { TeamMember } from '../models/csgoteam';

@Pipe({
  name: 'excludeMembers'
})
export class ExcludeMembersPipe implements PipeTransform {

  transform(summaries: SteamUserSummary [], members: TeamMember []): SteamUserSummary [] {
    if (summaries) {
      return summaries.filter(s => !members.find(m => m.UserId === s.steamid));
    }
    return null;
  }

}
