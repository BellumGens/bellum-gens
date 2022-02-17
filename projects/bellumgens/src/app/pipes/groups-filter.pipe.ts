import { Pipe, PipeTransform } from '@angular/core';
import { SteamGroup } from '../../../../common/src/public_api';

@Pipe({
  name: 'groupsFilter'
})
export class GroupsFilterPipe implements PipeTransform {

  public transform(groups: SteamGroup [], searchValue?: string): SteamGroup [] {
    let filtered = groups;
    if (searchValue) {
      filtered = filtered.filter(g => g.groupName && g.groupName.toLowerCase().includes(searchValue.toLowerCase()));
    }
    return filtered ? filtered.slice(0, 3) : filtered;
  }

}
