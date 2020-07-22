import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CSGOTournamentScheduleComponent } from './tournament-schedule.component';
import { IgxCalendarModule, IgxAvatarModule, IgxProgressBarModule, IgxGridModule } from '@infragistics/igniteui-angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BellumGensModule } from 'src-common/components/components.module';

describe('CSGOTournamentScheduleComponent', () => {
  let component: CSGOTournamentScheduleComponent;
  let fixture: ComponentFixture<CSGOTournamentScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CSGOTournamentScheduleComponent ],
      imports: [
        NoopAnimationsModule,
        HttpClientTestingModule,
        IgxCalendarModule,
        IgxAvatarModule,
        IgxProgressBarModule,
        IgxGridModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CSGOTournamentScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
