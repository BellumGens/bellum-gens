import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SC2TournamentScheduleComponent } from './tournament-schedule.component';
import { IgxCalendarModule, IgxAvatarModule, IgxIconModule, IgxProgressBarModule } from '@infragistics/igniteui-angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SC2TournamentScheduleComponent', () => {
  let component: SC2TournamentScheduleComponent;
  let fixture: ComponentFixture<SC2TournamentScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SC2TournamentScheduleComponent
      ],
      imports: [
        NoopAnimationsModule,
        HttpClientTestingModule,
        IgxCalendarModule,
        IgxAvatarModule,
        IgxIconModule,
        IgxProgressBarModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SC2TournamentScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
