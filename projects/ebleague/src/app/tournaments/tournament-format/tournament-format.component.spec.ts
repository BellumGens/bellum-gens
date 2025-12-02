import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TournamentFormatComponent } from './tournament-format.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('TournamentFormatComponent', () => {
  let component: TournamentFormatComponent;
  let fixture: ComponentFixture<TournamentFormatComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TournamentFormatComponent, RouterTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentFormatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
