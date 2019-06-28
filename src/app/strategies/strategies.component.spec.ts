import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategiesComponent } from './strategies.component';
import { IgxChipsModule, IgxCardModule, IgxButtonModule, IgxIconModule } from 'igniteui-angular';
import { MapnamePipe } from '../pipes/mapname.pipe';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActiveDutyMapsPipe } from '../pipes/active-duty-maps.pipe';

describe('StrategiesComponent', () => {
  let component: StrategiesComponent;
  let fixture: ComponentFixture<StrategiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        IgxChipsModule,
        IgxCardModule,
        IgxButtonModule,
        IgxIconModule
      ],
      declarations: [
        StrategiesComponent,
        MapnamePipe,
        ActiveDutyMapsPipe
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
