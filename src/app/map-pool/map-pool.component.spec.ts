import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapPoolComponent } from './map-pool.component';

describe('MapPoolComponent', () => {
  let component: MapPoolComponent;
  let fixture: ComponentFixture<MapPoolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapPoolComponent ]
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
