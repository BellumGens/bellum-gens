import { Pipe, PipeTransform } from '@angular/core';
import { SteamGroup } from '../models/steamuser';

@Pipe({
  name: 'groupsFilter'
})
export class GroupsFilterPipe implements PipeTransform {

  transform(groups: SteamGroup [], searchValue?: string): SteamGroup [] {
    let filtered = groups;
    if (searchValue) {
      filtered = filtered.filter(g => g.groupName && g.groupName.toLowerCase().includes(searchValue.toLowerCase()));
    }
    return filtered ? filtered.slice(0, 3) : filtered;
  }

}
