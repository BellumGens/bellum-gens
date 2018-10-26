import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamStrategiesComponent } from './team-strategies.component';

describe('TeamStrategiesComponent', () => {
  let component: TeamStrategiesComponent;
  let fixture: ComponentFixture<TeamStrategiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamStrategiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamStrategiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
