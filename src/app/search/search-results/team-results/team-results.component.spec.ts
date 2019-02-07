import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamResultsComponent } from './team-results.component';

describe('TeamResultsComponent', () => {
  let component: TeamResultsComponent;
  let fixture: ComponentFixture<TeamResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
