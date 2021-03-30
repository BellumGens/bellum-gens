import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MapPoolComponent } from './map-pool.component';
import { IgxCheckboxModule, IgxCardModule } from '@infragistics/igniteui-angular';
import { BellumGensModule } from 'src-common/lib/public_api';

describe('MapPoolComponent', () => {
  let component: MapPoolComponent;
  let fixture: ComponentFixture<MapPoolComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        IgxCheckboxModule,
        IgxCardModule,
        BellumGensModule
      ],
      declarations: [
        MapPoolComponent
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
