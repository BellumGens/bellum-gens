import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TournamentFormatComponent } from './tournament-format.component';
import { provideRouter } from '@angular/router';

describe('TournamentFormatComponent', () => {
  let component: TournamentFormatComponent;
  let fixture: ComponentFixture<TournamentFormatComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TournamentFormatComponent],
      providers: [provideRouter([])]
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
