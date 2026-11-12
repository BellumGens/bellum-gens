import { Pipe, PipeTransform } from '@angular/core';
import { SteamGroup } from 'bellum-gens-common/models';

@Pipe({
    name: 'groupsFilter'
})
export class GroupsFilterPipe implements PipeTransform {

  public transform(groups: SteamGroup [] | undefined, searchValue?: string): SteamGroup [] | undefined {
    let filtered = groups;
    if (searchValue) {
      filtered = filtered?.filter(g => g.groupName && g.groupName.toLowerCase().includes(searchValue.toLowerCase()));
    }
    return filtered ? filtered.slice(0, 3) : filtered;
  }

}
