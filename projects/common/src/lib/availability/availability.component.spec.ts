import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AvailabilityComponent } from './availability.component';
import { IGX_CHIPS_DIRECTIVES, IGX_TIME_PICKER_DIRECTIVES, IGX_DIALOG_DIRECTIVES } from '@infragistics/igniteui-angular';
import { WeekdayPipe } from '../pipes/weekday.pipe';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('AvailabilityComponent', () => {
  let component: AvailabilityComponent;
  let fixture: ComponentFixture<AvailabilityComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [
        NoopAnimationsModule,
        IGX_CHIPS_DIRECTIVES,
        IGX_TIME_PICKER_DIRECTIVES,
        IGX_DIALOG_DIRECTIVES,
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
