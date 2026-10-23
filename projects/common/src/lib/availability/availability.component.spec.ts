import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { IChipClickEventArgs, IgxChipComponent } from '@infragistics/igniteui-angular/chips';
import { IgxTimePickerComponent } from '@infragistics/igniteui-angular/time-picker';

import { AvailabilityComponent } from './availability.component';
import { Availability, DayOfWeek } from '../../models/playeravailability';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('AvailabilityComponent', () => {
  let component: AvailabilityComponent;
  let fixture: ComponentFixture<AvailabilityComponent>;

  // Local times, so the rendered 'H:mm' ranges do not depend on the machine's time zone.
  const monday: Availability = {
    day: DayOfWeek.Monday,
    available: true,
    from: new Date(2018, 0, 15, 18, 0),
    to: new Date(2018, 0, 15, 20, 30)
  };

  const chips = (): DebugElement[] => fixture.debugElement.queryAll(By.directive(IgxChipComponent));
  const chip = (day: DayOfWeek): DebugElement => chips()[day];
  const chipText = (day: DayOfWeek) => chip(day).nativeElement.querySelector('.igx-chip__text').textContent.trim();
  const chipSubtext = (day: DayOfWeek): HTMLElement | null => chip(day).nativeElement.querySelector('.igx-chip__subtext');
  // The chip click comes from its drag directive's pointer handling, which jsdom cannot drive.
  const clickChip = (day: DayOfWeek): IChipClickEventArgs => {
    const args = { owner: chip(day).componentInstance, originalEvent: new MouseEvent('click'), cancel: false } as IChipClickEventArgs;
    chip(day).triggerEventHandler('chipClick', args);
    return args;
  };
  const dialogButton = (label: string): HTMLButtonElement => Array.from(document.querySelectorAll<HTMLButtonElement>('.igx-dialog__window-actions button'))
    .find(b => b.textContent.trim() === label);
  const timePickers = (): IgxTimePickerComponent[] => fixture.debugElement.queryAll(By.directive(IgxTimePickerComponent))
    .map(de => de.componentInstance);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        AvailabilityComponent
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should augment the base availability from the availability input', () => {
    const setmonday: Availability = {
      day: DayOfWeek.Monday,
      available: true,
      from: new Date('2018-01-15T18:00:00.000Z'),
      to: new Date('2018-01-15T20:00:00.000Z')
    };
    fixture.componentRef.setInput('availability', [setmonday]);
    fixture.detectChanges();

    const day = component.baseAvailability().find(a => a.day === DayOfWeek.Monday);
    expect(day.available).toBe(true);
    expect(day.from).toEqual(setmonday.from);
    expect(day.to).toEqual(setmonday.to);
    expect(component.baseAvailability().filter(a => a.available).length).toBe(1);
  });

  it('should parse serialized dates from the availability input', () => {
    const serialized = { ...monday, from: monday.from.toISOString(), to: monday.to.toISOString() } as unknown as Availability;
    fixture.componentRef.setInput('availability', [serialized]);
    fixture.detectChanges();

    const day = component.baseAvailability().find(a => a.day === DayOfWeek.Monday);
    expect(day.from).toEqual(monday.from);
    expect(day.to).toEqual(monday.to);
  });

  it('should fall back to the base week when no availability is passed', () => {
    fixture.componentRef.setInput('availability', [monday]);
    fixture.detectChanges();

    fixture.componentRef.setInput('availability', null);
    fixture.detectChanges();

    expect(component.baseAvailability().length).toBe(7);
    expect(component.baseAvailability().some(a => a.available)).toBe(false);
  });

  it('should replace the previous schedule when a different availability is passed', () => {
    const monday: Availability = { day: DayOfWeek.Monday, available: true, from: new Date('2018-01-15T18:00:00.000Z'), to: new Date('2018-01-15T20:00:00.000Z') };
    const tuesday: Availability = { day: DayOfWeek.Tuesday, available: true, from: new Date('2018-01-16T18:00:00.000Z'), to: new Date('2018-01-16T20:00:00.000Z') };
    fixture.componentRef.setInput('availability', [monday]);
    fixture.detectChanges();

    fixture.componentRef.setInput('availability', [tuesday]);
    fixture.detectChanges();

    const available = component.baseAvailability().filter(a => a.available);
    expect(available.map(a => a.day)).toEqual([DayOfWeek.Tuesday]);
  });

  it('should reset to the base week when an empty availability is passed after a schedule', () => {
    const monday: Availability = { day: DayOfWeek.Monday, available: true, from: new Date('2018-01-15T18:00:00.000Z'), to: new Date('2018-01-15T20:00:00.000Z') };
    fixture.componentRef.setInput('availability', [monday]);
    fixture.detectChanges();

    fixture.componentRef.setInput('availability', []);
    fixture.detectChanges();

    expect(component.baseAvailability().some(a => a.available)).toBe(false);
  });

  it('should keep local edits while the availability input stays the same', () => {
    const monday: Availability = { day: DayOfWeek.Monday, available: true, from: new Date('2018-01-15T18:00:00.000Z'), to: new Date('2018-01-15T20:00:00.000Z') };
    fixture.componentRef.setInput('availability', [monday]);
    fixture.detectChanges();
    const args = { originalEvent: { stopPropagation: vi.fn() } } as any;

    component.dayDeselected(args, component.baseAvailability().find(a => a.day === DayOfWeek.Monday));
    fixture.detectChanges();

    expect(component.baseAvailability().find(a => a.day === DayOfWeek.Monday).available).toBe(false);
  });

  it('should mark a day unavailable and emit on deselect', () => {
    const emitSpy = vi.spyOn(component.availabilityChanged, 'emit');
    const day = { ...component.baseAvailability()[1], available: true };
    const args = { originalEvent: { stopPropagation: vi.fn() } } as any;

    component.dayDeselected(args, day);

    expect(emitSpy).toHaveBeenCalledWith({ ...day, available: false });
    expect(component.baseAvailability()[1].available).toBe(false);
  });

  it('should only open the dialog when editable', () => {
    const day = component.baseAvailability()[0];
    const args = { cancel: false } as any;

    component.daySelected(args, day);
    expect(component.selectedDay()).toBeNull();

    fixture.componentRef.setInput('editable', true);
    fixture.detectChanges();
    component.daySelected(args, day);
    expect(args.cancel).toBe(true);
    expect(component.selectedDay()).toBe(day);
  });

  describe('rendering', () => {
    beforeEach(async () => {
      fixture.componentRef.setInput('availability', [monday]);
      await fixture.whenStable();
    });

    it('should render a chip per day of the week', () => {
      expect(chips().length).toBe(7);
      expect(chips().map((_, day) => chipText(day))).toEqual([
        'Sundays', 'Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays'
      ]);
    });

    it('should render the time range only for the available days', () => {
      expect(chipSubtext(DayOfWeek.Monday).textContent.trim()).toBe('18:00-20:30');
      expect(chipSubtext(DayOfWeek.Sunday)).toBeNull();
      expect(chipSubtext(DayOfWeek.Tuesday)).toBeNull();
    });

    it('should select the chips of the available days', () => {
      expect(chips().map(c => c.componentInstance.selected)).toEqual([false, true, false, false, false, false, false]);
    });

    it('should render read-only chips when not editable', () => {
      expect(chips().every(c => !c.componentInstance.selectable && !c.componentInstance.removable)).toBe(true);
      expect(fixture.nativeElement.querySelector('.igx-chip__remove')).toBeNull();
    });

    it('should not open the dialog when a read-only chip is clicked', () => {
      const args = clickChip(DayOfWeek.Monday);

      expect(args.cancel).toBe(false);
      expect(component.selectedDay()).toBeNull();
      expect(component['dialog']().isOpen).toBe(false);
    });

    it('should render an empty day in the dialog title until a day is selected', () => {
      const title = fixture.debugElement.query(By.css('[igxDialogTitle]')).nativeElement;
      expect(title.querySelector('.highlight').textContent).toBe('');
      expect(timePickers().length).toBe(0);
    });
  });

  describe('when editable', () => {
    let emitted: Availability[];

    beforeEach(async () => {
      emitted = [];
      component.availabilityChanged.subscribe(day => emitted.push(day));
      fixture.componentRef.setInput('availability', [monday]);
      fixture.componentRef.setInput('editable', true);
      await fixture.whenStable();
    });

    afterEach(() => {
      component['dialog']().close();
    });

    it('should render selectable chips that are removable only when available', () => {
      expect(chips().every(c => c.componentInstance.selectable)).toBe(true);
      expect(chips().map(c => c.componentInstance.removable)).toEqual([false, true, false, false, false, false, false]);
      expect(fixture.nativeElement.querySelectorAll('.igx-chip__remove').length).toBe(1);
    });

    it('should open the dialog for the clicked day, cancelling the chip selection toggle', async () => {
      const args = clickChip(DayOfWeek.Monday);
      await fixture.whenStable();

      expect(args.cancel).toBe(true);
      expect(component.selectedDay().day).toBe(DayOfWeek.Monday);
      expect(component['dialog']().isOpen).toBe(true);
      const title = fixture.debugElement.query(By.css('[igxDialogTitle]')).nativeElement;
      expect(title.querySelector('.highlight').textContent).toBe('Mondays');
      expect(timePickers().map(p => p.value)).toEqual([monday.from, monday.to]);
    });

    it('should make the day available with the picked times on submit', async () => {
      clickChip(DayOfWeek.Wednesday);
      await fixture.whenStable();
      const from = new Date(2018, 0, 17, 19, 15);
      const to = new Date(2018, 0, 17, 22, 45);
      const [fromPicker, toPicker] = timePickers();
      fromPicker.value = from;
      toPicker.value = to;

      dialogButton('Submit').click();
      await fixture.whenStable();

      expect(emitted.length).toBe(1);
      expect(emitted[0]).toEqual(expect.objectContaining({ day: DayOfWeek.Wednesday, available: true, from, to }));
      expect(component.baseAvailability()[DayOfWeek.Wednesday]).toEqual(emitted[0]);
      expect(component['dialog']().isOpen).toBe(false);
      expect(chipSubtext(DayOfWeek.Wednesday).textContent.trim()).toBe('19:15-22:45');
      expect(chip(DayOfWeek.Wednesday).componentInstance.removable).toBe(true);
    });

    it('should leave the day untouched when the dialog is cancelled', async () => {
      clickChip(DayOfWeek.Monday);
      await fixture.whenStable();
      timePickers()[0].value = new Date(2018, 0, 15, 8, 0);

      dialogButton('Cancel').click();
      await fixture.whenStable();

      expect(emitted.length).toBe(0);
      expect(component['dialog']().isOpen).toBe(false);
      expect(component.baseAvailability()[DayOfWeek.Monday]).toEqual(monday);
      expect(chipSubtext(DayOfWeek.Monday).textContent.trim()).toBe('18:00-20:30');
    });

    it('should make a day unavailable when its chip is removed', async () => {
      const removeButton: HTMLElement = chip(DayOfWeek.Monday).nativeElement.querySelector('.igx-chip__remove');
      const click = new MouseEvent('click', { bubbles: true });
      const stopPropagation = vi.spyOn(click, 'stopPropagation');

      removeButton.dispatchEvent(click);
      await fixture.whenStable();

      expect(stopPropagation).toHaveBeenCalled();
      expect(emitted).toEqual([{ ...monday, available: false }]);
      expect(chipSubtext(DayOfWeek.Monday)).toBeNull();
      expect(chip(DayOfWeek.Monday).componentInstance.selected).toBe(false);
      expect(fixture.nativeElement.querySelector('.igx-chip__remove')).toBeNull();
    });
  });
});
