import { Component } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { CREW_MEMBERS } from '../../../../src-common/models/misc';

@Component({
  selector: 'app-production-crew',
  templateUrl: './production-crew.component.html',
  styleUrls: ['./production-crew.component.scss']
})
export class ProductionCrewComponent {
  public crewMembers = CREW_MEMBERS;

  constructor() {
  }

}
