import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvailabilityComponent } from './availability.component';
import { Availability, DayOfWeek } from '../../models/playeravailability';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('AvailabilityComponent', () => {
  let component: AvailabilityComponent;
  let fixture: ComponentFixture<AvailabilityComponent>;

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
    const monday: Availability = {
      day: DayOfWeek.Monday,
      available: true,
      from: new Date('2018-01-15T18:00:00.000Z'),
      to: new Date('2018-01-15T20:00:00.000Z')
    };
    fixture.componentRef.setInput('availability', [monday]);
    fixture.detectChanges();

    const day = component.baseAvailability().find(a => a.day === DayOfWeek.Monday);
    expect(day.available).toBe(true);
    expect(day.from).toEqual(monday.from);
    expect(day.to).toEqual(monday.to);
    expect(component.baseAvailability().filter(a => a.available).length).toBe(1);
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
});
