import { NgModule } from '@angular/core';

import { CSGOMapimagePipe } from './pipes/csgomapimage.pipe';
import { CSGOMapnamePipe } from './pipes/csgomapname.pipe';
import { Sc2MapNamePipe } from './pipes/sc2-map-name.pipe';
import { PlayerCountryPipe } from './pipes/player-country.pipe';
import { ActiveDutyMapsPipe } from './pipes/active-duty-maps.pipe';


@NgModule({
  declarations: [
    CSGOMapimagePipe,
    CSGOMapnamePipe,
    Sc2MapNamePipe,
    PlayerCountryPipe,
    ActiveDutyMapsPipe
  ],
  exports: [
    CSGOMapimagePipe,
    CSGOMapnamePipe,
    Sc2MapNamePipe,
    PlayerCountryPipe,
    ActiveDutyMapsPipe
  ]
})
export class BellumGensModule {}
