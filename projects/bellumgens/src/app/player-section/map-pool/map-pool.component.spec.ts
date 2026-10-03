import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapPoolComponent } from './map-pool.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('MapPoolComponent', () => {
  let component: MapPoolComponent;
  let fixture: ComponentFixture<MapPoolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
        imports: [
            NoopAnimationsModule,
            MapPoolComponent
        ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapPoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and augment rendered map pool', () => {
    expect(component).toBeTruthy();
    fixture.componentRef.setInput('mapPool', [
      { mapId: 1, isPlayed: true },
      { mapId: 3, isPlayed: true }
    ]);

    expect(component.maps().find(m => m.mapId === 1).isPlayed).toBe(true);
    expect(component.maps().find(m => m.mapId === 2).isPlayed).toBe(false);
    expect(component.maps().find(m => m.mapId === 3).isPlayed).toBe(true);
  });

  it('should update the toggled map and emit it', () => {
    const emitSpy = vi.spyOn(component.update, 'emit');
    const map = component.maps().find(m => m.mapId === 2);

    component.mapChange(map, true);

    expect(component.maps().find(m => m.mapId === 2).isPlayed).toBe(true);
    expect(emitSpy).toHaveBeenCalledWith(expect.objectContaining({ mapId: 2, isPlayed: true }));
  });
});
