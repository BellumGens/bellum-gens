import { Component, ViewChild, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Availability } from '../../models/playeravailability';
import {
  IgxTimePickerComponent,
  IgxChipsAreaComponent,
  IgxDialogComponent,
  IgxChipComponent,
  IChipClickEventArgs,
  IBaseChipEventArgs
} from '@infragistics/igniteui-angular';

@Component({
  selector: 'bg-availability',
  templateUrl: './availability.component.html',
  styleUrls: ['./availability.component.scss']
})
export class AvailabilityComponent {
  @Input()
  public availability: Availability [];

  @Input()
  public editable = false;

  @Output()
  public availabilityChanged = new EventEmitter<Availability>();

  @ViewChild('from')
  private from: IgxTimePickerComponent;

  @ViewChild('to')
  private to: IgxTimePickerComponent;

  @ViewChild(IgxChipsAreaComponent, { static: true })
  private chips: IgxChipsAreaComponent;

  @ViewChild(IgxDialogComponent, { static: true })
  private dialog: IgxDialogComponent;

  public selectedChip: IgxChipComponent;
  public get selectedDay() {
    return this._availability;
  }

  public set selectedDay(day: Availability) {
    this._availability = day;
    this._availability.from = new Date(day.from);
    this._availability.to = new Date(day.to);
  }

  private _availability: Availability;

  constructor(private _cdr: ChangeDetectorRef) { }

  public daySelected(args: IChipClickEventArgs) {
    if (this.editable) {
      const index = this.chips.chipsList.toArray().indexOf(args.owner);
      this.selectedDay = this.availability[index];
      this.dialog.open();

      //args.owner.selected = true;
      args.cancel = true;
      this.selectedChip = args.owner;
    }
  }

  public dayDeselected(args: IBaseChipEventArgs) {
    const index = this.chips.chipsList.toArray().indexOf(args.owner);
    const availability = this.availability[index];
    (args.originalEvent as PointerEvent).stopPropagation();
    availability.available = false;
    this.availabilityChanged.emit(availability);
    this._cdr.detectChanges();
  }

  public availabilityChange() {
    this.selectedDay.from = this.from.value;
    this.selectedDay.to = this.to.value;
    this.selectedDay.available = true;
    this.availabilityChanged.emit(this.selectedDay);
    this.dialog.close();
  }

  public availabilityCancel() {
    this.dialog.close();
  }
}