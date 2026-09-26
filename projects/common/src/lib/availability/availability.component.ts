import { Component, input, linkedSignal, output, signal, viewChild } from '@angular/core';
import { Availability, BASE_AVAILABILITY } from '../../models/playeravailability';
import { IgxTimePickerComponent } from '@infragistics/igniteui-angular/time-picker';
import { IgxDialogComponent } from '@infragistics/igniteui-angular/dialog';
import { IBaseChipEventArgs, IChipClickEventArgs, IGX_CHIPS_DIRECTIVES } from '@infragistics/igniteui-angular/chips';
import { IgxLabelDirective } from '@infragistics/igniteui-angular/input-group';
import { WeekdayPipe } from '../pipes/weekday.pipe';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'bg-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.scss'],
  imports: [
    IGX_CHIPS_DIRECTIVES,
    IgxDialogComponent,
    IgxTimePickerComponent,
    IgxLabelDirective,
    DatePipe,
    WeekdayPipe
  ]
})
export class AvailabilityComponent {
  public availability = input<Availability []>([]);
  public editable = input(false);
  public availabilityChanged = output<Availability>();

  // Local week schedule: re-augmented whenever a non-empty availability is passed in,
  // otherwise it keeps its current state (including edits made in this component).
  public baseAvailability = linkedSignal<Availability [], Availability []>({
    source: this.availability,
    computation: (availability, previous) => {
      const base = previous?.value ?? structuredClone(BASE_AVAILABILITY);
      if (!availability?.length) {
        return base;
      }
      return base.map(day => {
        const playerAvailability = availability.find(a => a.day === day.day);
        return playerAvailability ? {
          ...day,
          available: playerAvailability.available,
          from: new Date(playerAvailability.from),
          to: new Date(playerAvailability.to)
        } : day;
      });
    }
  });

  public selectedDay = signal<Availability | null>(null);

  private from = viewChild<IgxTimePickerComponent>('from');
  private to = viewChild<IgxTimePickerComponent>('to');
  private dialog = viewChild.required(IgxDialogComponent);

  public daySelected(args: IChipClickEventArgs, day: Availability) {
    if (this.editable()) {
      args.cancel = true;
      this.selectedDay.set(day);
      this.dialog().open();
    }
  }

  public dayDeselected(args: IBaseChipEventArgs, day: Availability) {
    (args.originalEvent as PointerEvent).stopPropagation();
    this.updateDay({ ...day, available: false });
  }

  public availabilityChange() {
    this.updateDay({
      ...this.selectedDay(),
      from: this.from().value as Date,
      to: this.to().value as Date,
      available: true
    });
    this.dialog().close();
  }

  public availabilityCancel() {
    this.dialog().close();
  }

  private updateDay(day: Availability) {
    this.baseAvailability.update(days => days.map(d => d.day === day.day ? day : d));
    this.availabilityChanged.emit(day);
  }
}
