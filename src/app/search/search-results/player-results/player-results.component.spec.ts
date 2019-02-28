import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerResultsComponent } from './player-results.component';
import { IgxProgressBarModule, IgxCardModule, IgxAvatarModule, IgxChipsModule } from 'igniteui-angular';
import { DaysAvailablePipe } from 'src/app/pipes/days-available.pipe';
import { WeekdayPipe } from 'src/app/pipes/weekday.pipe';
import { RouterTestingModule } from '@angular/router/testing';

describe('PlayerResultsComponent', () => {
  let component: PlayerResultsComponent;
  let fixture: ComponentFixture<PlayerResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        IgxProgressBarModule,
        IgxCardModule,
        IgxAvatarModule,
        IgxChipsModule
      ],
      declarations: [
        PlayerResultsComponent,
        DaysAvailablePipe,
        WeekdayPipe
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
