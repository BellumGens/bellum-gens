import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TournamentComponent } from './tournament.component';

describe('TournamentComponent', () => {
  let component: TournamentComponent;
  let fixture: ComponentFixture<TournamentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TournamentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
