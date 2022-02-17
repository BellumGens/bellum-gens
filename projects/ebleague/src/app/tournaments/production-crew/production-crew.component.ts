import { Component, Inject, LOCALE_ID } from '@angular/core';
import { CREW_MEMBERS, CREW_MEMBERS_BG } from '../../../../../common/src/public_api';

@Component({
  selector: 'app-production-crew',
  templateUrl: './production-crew.component.html',
  styleUrls: ['./production-crew.component.scss']
})
export class ProductionCrewComponent {
  public crewMembers = CREW_MEMBERS;

  constructor(@Inject(LOCALE_ID) localeId: string) {
    if (localeId === 'bg') {
      this.crewMembers.map((item, i) => Object.assign(item, CREW_MEMBERS_BG[i]));
    }
  }

}
