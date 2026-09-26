import { Component, LOCALE_ID, inject } from '@angular/core';
import { CREW_MEMBERS, CREW_MEMBERS_BG } from '../../../../../common/src/public_api';
import { IGX_CARD_DIRECTIVES } from '@infragistics/igniteui-angular/card';
import { IgxButtonDirective } from '@infragistics/igniteui-angular/directives';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
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
  private localeId = inject(LOCALE_ID);

  // Localized copies instead of mutating the shared CREW_MEMBERS constant.
  public crewMembers = this.localeId === 'bg'
    ? CREW_MEMBERS.map((item, i) => ({ ...item, ...CREW_MEMBERS_BG[i] }))
    : CREW_MEMBERS;
}
