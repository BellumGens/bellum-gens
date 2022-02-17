import { Pipe, PipeTransform } from '@angular/core';
import { TeamMember } from '../../common/src/models/csgoteam';
import { PlaystyleRole, RoleSlot } from '../../common/src/models/playerrole';

@Pipe({
  name: 'openPositions'
})
export class OpenPositionsPipe implements PipeTransform {

  public transform(members: TeamMember []): RoleSlot [] {
    const roleSlots = [
      { roleName: 'IGL', role: PlaystyleRole.IGL, user: null },
      { roleName: 'Awper', role: PlaystyleRole.Awper, user: null },
      { roleName: 'Entry Fragger', role: PlaystyleRole.EntryFragger, user: null },
      { roleName: 'Support', role: PlaystyleRole.Support, user: null },
      { roleName: 'Lurker', role: PlaystyleRole.Lurker, user: null }
    ];
    roleSlots.forEach(role => {
      if (members.find(m => m.isActive && m.role === role.role)) {
        roleSlots.splice(roleSlots.indexOf(role), 1);
      }
    });
    return roleSlots;
  }

}
