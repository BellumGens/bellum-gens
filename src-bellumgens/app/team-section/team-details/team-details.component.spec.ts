import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TeamDetailsComponent } from './team-details.component';
import { AvailabilityComponent } from 'src-bellumgens/app/availability/availability.component';
import { IgxAvatarModule,
  IgxCardModule,
  IgxDragDropModule,
  IgxChipsModule,
  IgxTimePickerModule,
  IgxDialogModule,
  IgxRippleModule } from '@infragistics/igniteui-angular';
import { RouterTestingModule } from '@angular/router/testing';
import { PlayerCountryPipe } from 'src-bellumgens/app/pipes/player-country.pipe';
import { WeekdayPipe } from 'src-bellumgens/app/pipes/weekday.pipe';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { BellumGensModule } from 'src-common/components/components.module';

describe('TeamDetailsComponent', () => {
  let component: TeamDetailsComponent;
  let fixture: ComponentFixture<TeamDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NoopAnimationsModule,
        HttpClientTestingModule,
        ServiceWorkerModule.register('', {enabled: false}),
        IgxAvatarModule,
        IgxCardModule,
        IgxDragDropModule,
        IgxChipsModule,
        IgxTimePickerModule,
        IgxDialogModule,
        IgxRippleModule,
        BellumGensModule
      ],
      declarations: [
        TeamDetailsComponent,
        AvailabilityComponent,
        PlayerCountryPipe,
        WeekdayPipe
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {
              params: new Observable()
            },
            data: new Observable()
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
