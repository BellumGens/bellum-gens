import { Pipe, PipeTransform } from '@angular/core';
import { SteamUserSummary } from '../../../src-common/models/steamuser';
import { TeamMember } from '../../../src-common/models/csgoteam';

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
