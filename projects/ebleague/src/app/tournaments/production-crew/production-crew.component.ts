import { Component, LOCALE_ID, inject } from '@angular/core';
import { CREW_MEMBERS, CREW_MEMBERS_BG } from '../../../../../common/src/public_api';
import { IGX_CARD_DIRECTIVES, IgxButtonDirective, IgxIconComponent } from '@infragistics/igniteui-angular';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-production-crew',
  templateUrl: './production-crew.component.html',
  styleUrls: ['./production-crew.component.scss'],
  imports: [
    NgOptimizedImage,
    IGX_CARD_DIRECTIVES,
    IgxButtonDirective,
    IgxIconComponent
  ]
})
export class ProductionCrewComponent {
  public crewMembers = CREW_MEMBERS;

  constructor() {
    const localeId = inject(LOCALE_ID);

    if (localeId === 'bg') {
      this.crewMembers.map((item, i) => Object.assign(item, CREW_MEMBERS_BG[i]));
    }
  }

}
