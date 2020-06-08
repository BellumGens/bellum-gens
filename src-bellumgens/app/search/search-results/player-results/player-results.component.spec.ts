import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerResultsComponent } from './player-results.component';
import { IgxProgressBarModule, IgxCardModule, IgxAvatarModule, IgxChipsModule, IgxIconModule } from '@infragistics/igniteui-angular';
import { DaysAvailablePipe } from 'src-bellumgens/app/pipes/days-available.pipe';
import { WeekdayPipe } from 'src-bellumgens/app/pipes/weekday.pipe';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { QueryParsedPipe } from 'src-bellumgens/app/pipes/query-parsed.pipe';
import { AppShellComponent } from 'src-bellumgens/app/app-shell/app-shell.component';

describe('PlayerResultsComponent', () => {
  let component: PlayerResultsComponent;
  let fixture: ComponentFixture<PlayerResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        IgxProgressBarModule,
        IgxCardModule,
        IgxAvatarModule,
        IgxChipsModule,
        IgxIconModule
      ],
      declarations: [
        PlayerResultsComponent,
        AppShellComponent,
        DaysAvailablePipe,
        WeekdayPipe,
        QueryParsedPipe
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
