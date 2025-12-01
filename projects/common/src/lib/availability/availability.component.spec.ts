import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AvailabilityComponent } from './availability.component';
import { IgxChipsModule } from '@infragistics/igniteui-angular/chips';
import { IgxTimePickerModule } from '@infragistics/igniteui-angular/time-picker';
import { IgxDialogModule } from '@infragistics/igniteui-angular/dialog';
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
        IgxDialogModule,
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
