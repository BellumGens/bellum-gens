import { Component, ViewChild, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Availability } from '../models/playeravailability';
import { IgxTimePickerComponent,
  IChipSelectEventArgs,
  IgxChipsAreaComponent,
  IgxDialogComponent,
  IgxChipComponent,
  IChipClickEventArgs} from 'igniteui-angular';

@Component({
  selector: 'app-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.css']
})
export class AvailabilityComponent {
  selectedChip: IgxChipComponent;
  public get selectedDay() {
    return this._availability;
  }

  public set selectedDay(day: Availability) {
    this._availability = day;
    this._availability.From = new Date(day.From);
    this._availability.To = new Date(day.To);
  }

  @Input()
  public availability: Availability [];

  @Input()
  public editable = false;

  @Output()
  public availabilityChanged = new EventEmitter<Availability>();

  @ViewChild('from', { static: false }) public from: IgxTimePickerComponent;
  @ViewChild('to', { static: false }) public to: IgxTimePickerComponent;
  @ViewChild(IgxChipsAreaComponent, { static: true }) public chips: IgxChipsAreaComponent;
  @ViewChild(IgxDialogComponent, { static: true }) public dialog: IgxDialogComponent;

  private _availability: Availability;

  constructor(private _cdr: ChangeDetectorRef) { }

  public daySelected(args: IChipClickEventArgs) {
    if (this.editable) {
      const index = this.chips.chipsList.toArray().indexOf(args.owner);
      this.selectedDay = this.availability[index];
      this.dialog.open();

      args.owner.selected = true;
      args.cancel = true;
      this.selectedChip = args.owner;
    }
  }

  public dayDeselected(args: IChipSelectEventArgs) {
    const index = this.chips.chipsList.toArray().indexOf(args.owner);
    const availability = this.availability[index];
    (args.originalEvent as PointerEvent).stopPropagation();
    availability.Available = false;
    this.availabilityChanged.emit(availability);
    this._cdr.detectChanges();
  }

  public availabilityChange() {
    this.selectedDay.From = this.from.value;
    this.selectedDay.To = this.to.value;
    this.selectedDay.Available = true;
    this.availabilityChanged.emit(this.selectedDay);
    this.dialog.close();
  }

  public availabilityCancel() {
    this.dialog.close();
  }
}
