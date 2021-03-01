import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AvailabilityComponent } from './availability.component';
import { IgxChipsModule, IgxTimePickerModule, IgxDialogModule } from '@infragistics/igniteui-angular';
import { WeekdayPipe } from '../pipes/weekday.pipe';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('AvailabilityComponent', () => {
  let component: AvailabilityComponent;
  let fixture: ComponentFixture<AvailabilityComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        IgxChipsModule,
        IgxTimePickerModule,
        IgxDialogModule
      ],
      declarations: [
        AvailabilityComponent,
        WeekdayPipe
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
