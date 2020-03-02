import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapPoolComponent } from './map-pool.component';
import { CSGOMapnamePipe } from '../pipes/mapname.pipe';
import { MapimagePipe } from '../pipes/mapimage.pipe';
import { IgxCheckboxModule, IgxCardModule } from 'igniteui-angular';
import { ActiveDutyMapsPipe } from '../pipes/active-duty-maps.pipe';

describe('MapPoolComponent', () => {
  let component: MapPoolComponent;
  let fixture: ComponentFixture<MapPoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        IgxCheckboxModule,
        IgxCardModule
      ],
      declarations: [
        MapPoolComponent,
        MapimagePipe,
        CSGOMapnamePipe,
        ActiveDutyMapsPipe
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapPoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
