import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsComponent } from './events.component';
import { RouterTestingModule } from '@angular/router/testing';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import bg from '@angular/common/locales/bg';

describe('EventsComponent', () => {
  let component: EventsComponent;
  let fixture: ComponentFixture<EventsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        EventsComponent
      ]
    });
    fixture = TestBed.createComponent(EventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize invitedPlayers array correctly', () => {
    expect(component.invitedPlayers.length).toBe(4);
    expect(component.invitedPlayers[0].name).toBe('Clement "Clem" Desplanches');
  });

  it('should initialize qualifiedPlayers array correctly', () => {
    expect(component.qualifiedPlayers.length).toBe(12);
    expect(component.qualifiedPlayers[0].name).toBe('Yoon "trigger" Hong');
  });

  it('should calculate time left correctly', () => {
    component.isoDate = '2025-06-04T10:00:00Z';
    component.announcementDate = new Date('2025-06-04T10:00:00Z');
    let mockDate = new Date('2025-06-03T10:00:00Z');
    jasmine.clock().mockDate(mockDate);
    component.timeLeft();
    expect(component.days).toBe(1);
    expect(component.hours).toBe(0);
    expect(component.minutes).toBe(0);
    expect(component.seconds).toBe(0);

    mockDate = new Date('2025-06-05T10:00:00Z');
    jasmine.clock().mockDate(mockDate);
    // spyOn(component.sub, 'unsubscribe').and.callThrough();
    component.timeLeft();
    expect(component.days).toBe(0);
    expect(component.hours).toBe(0);
    expect(component.minutes).toBe(0);
    expect(component.seconds).toBe(0);
    // expect(component.sub.unsubscribe).toHaveBeenCalled();
  });

  // it('should unsubscribe from interval on destroy', () => {
  //   spyOn(component.sub, 'unsubscribe').and.callThrough();
  //   component.ngOnDestroy();
  //   expect(component.sub.unsubscribe).toHaveBeenCalled();
  // });

  it('should scroll to the correct element', () => {
    const elementId = 'test-id';
    const mockElement = document.createElement('div');
    mockElement.id = elementId;
    spyOn(mockElement, 'scrollIntoView');
    document.body.appendChild(mockElement);

    component.scrollTo(elementId);
    expect(mockElement.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });

    document.body.removeChild(mockElement);
  });
});

describe('EventsComponent - bg locale', () => {
  let component: EventsComponent;
  let fixture: ComponentFixture<EventsComponent>;
  registerLocaleData(bg, 'bg');

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        EventsComponent
      ],
      providers: [
        { provide: LOCALE_ID, useValue: 'bg' }
      ]
    });
    fixture = TestBed.createComponent(EventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should set ticketsUrl to Bulgarian URL', () => {
    expect(component.ticketsUrl).toContain('eventim.bg/bg');
    expect(component.ticketsUrl).not.toContain('eventim.bg/en');
  });
});
