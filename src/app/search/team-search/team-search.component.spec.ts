import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamSearchComponent } from './team-search.component';

describe('TeamSearchComponent', () => {
  let component: TeamSearchComponent;
  let fixture: ComponentFixture<TeamSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
