import { Component, ViewChild, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Availability } from '../models/playeravailability';
import { IgxTimePickerComponent,
  IChipSelectEventArgs,
  IgxChipsAreaComponent,
  IgxDialogComponent,
  IgxChipComponent} from 'igniteui-angular';

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

  @ViewChild('from') public from: IgxTimePickerComponent;
  @ViewChild('to') public to: IgxTimePickerComponent;
  @ViewChild(IgxChipsAreaComponent) public chips: IgxChipsAreaComponent;
  @ViewChild(IgxDialogComponent) public dialog: IgxDialogComponent;

  private _availability: Availability;

  constructor(private _cdr: ChangeDetectorRef) { }

  public daySelected(args: IChipSelectEventArgs) {
    if (this.chips && args.originalEvent) {
      const index = this.chips.chipsList.toArray().indexOf(args.owner);
      this.selectedDay = this.availability[index];
      this.dialog.open();

      if (!args.selected) {
        args.cancel = true;
      } else {
        this.selectedChip = args.owner;
      }
    }
  }

  public dayDeselected(args: IChipSelectEventArgs) {
    const index = this.chips.chipsList.toArray().indexOf(args.owner);
    const availability = this.availability[index];
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
    if (this.selectedChip) {
      this.selectedChip.selected = false;
    }
    this.dialog.close();
  }
}
