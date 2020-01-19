import { Component } from '@angular/core';
import { BaseComponent } from '../../../../src-bellumgens/app/base/base.component';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { CREW_MEMBERS } from '../../../../src-common/models/misc';

@Component({
  selector: 'app-production-crew',
  templateUrl: './production-crew.component.html',
  styleUrls: ['./production-crew.component.scss']
})
export class ProductionCrewComponent extends BaseComponent {
  public crewMembers = CREW_MEMBERS;

  constructor(title: Title, meta: Meta, route: ActivatedRoute) {
    super(title, meta, route);
  }

}
