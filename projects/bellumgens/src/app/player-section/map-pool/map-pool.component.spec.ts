import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MapPoolComponent } from './map-pool.component';
import { IgxCheckboxModule, IgxCardModule } from '@infragistics/igniteui-angular';
import { BellumGensModule } from 'projects/common/src/public_api';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

describe('MapPoolComponent', () => {
  let component: MapPoolComponent;
  let fixture: ComponentFixture<MapPoolComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        IgxCheckboxModule,
        IgxCardModule,
        NoopAnimationsModule,
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

  it('should create and augment rendered map pool', () => {
    expect(component).toBeTruthy();
    component.mapPool = [
      { mapId: 1, isPlayed: true },
      { mapId: 3, isPlayed: true }
    ];

    expect(component.maps.find(m => m.mapId === 1).isPlayed).toBeTrue();
    expect(component.maps.find(m => m.mapId === 2).isPlayed).toBeFalse();
    expect(component.maps.find(m => m.mapId === 3).isPlayed).toBeTrue();
  });
});
