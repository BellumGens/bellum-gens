import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamResultsComponent } from './team-results.component';
import { IgxProgressBarModule, IgxCardModule, IgxAvatarModule, IgxChipsModule } from 'igniteui-angular';
import { RouterTestingModule } from '@angular/router/testing';
import { DaysAvailablePipe } from 'src/app/pipes/days-available.pipe';
import { OpenPositionsPipe } from 'src/app/pipes/open-positions.pipe';
import { WeekdayPipe } from 'src/app/pipes/weekday.pipe';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TeamResultsComponent', () => {
  let component: TeamResultsComponent;
  let fixture: ComponentFixture<TeamResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        IgxProgressBarModule,
        IgxCardModule,
        IgxAvatarModule,
        IgxChipsModule
      ],
      declarations: [
        TeamResultsComponent,
        DaysAvailablePipe,
        OpenPositionsPipe,
        WeekdayPipe
      ]
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
