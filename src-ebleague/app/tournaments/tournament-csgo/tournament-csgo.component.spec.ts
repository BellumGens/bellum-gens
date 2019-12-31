import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentCsgoComponent } from './tournament-csgo.component';

describe('TournamentCsgoComponent', () => {
  let component: TournamentCsgoComponent;
  let fixture: ComponentFixture<TournamentCsgoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TournamentCsgoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentCsgoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
