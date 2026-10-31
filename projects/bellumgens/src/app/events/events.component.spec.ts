import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventsComponent } from './events.component';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import bg from '@angular/common/locales/bg';
import { of } from 'rxjs';

describe('EventsComponent', () => {
  let component: EventsComponent;
  let fixture: ComponentFixture<EventsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        EventsComponent
      ],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({})
          }
        }
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

  it('should render the country, team and qualification of every player and caster when known', () => {
    const cards = (id: string) => Array.from<HTMLElement>(fixture.nativeElement.querySelectorAll(`#${id} .player-card`));
    const invited = cards('confirmed-players')[0];

    expect(invited.querySelector('.player-card-name').textContent).toContain('Clem');
    expect(invited.querySelector('igx-avatar').getAttribute('title')).toBe('France');
    expect(invited.querySelector('.player-card-team').textContent).toBe('Team Liquid');
    expect(invited.querySelector('.player-card-source').textContent).toContain('Champion');
    expect(cards('qualified-players').length).toBe(12);
    expect(cards('talent')[0].querySelector('.player-card-team').textContent).toBe('Commentator');
  });

  it('should not show a flag for a player whose country is unknown', () => {
    fixture.destroy();
    fixture = TestBed.createComponent(EventsComponent);
    component = fixture.componentInstance;
    component.invitedPlayers = [];
    component.qualifiedPlayers = [{ name: 'Player', country: '', race: 'Protoss', team: 'Team', source: 'Open Qualifier', image: '/p.png' }];
    component.talent = [];
    fixture.detectChanges();

    const card: HTMLElement = fixture.nativeElement.querySelector('.player-card');
    expect(card.querySelector('igx-avatar')).toBeNull();
    expect(card.querySelector('.player-card-team').textContent).toBe('Team');
  });

  it('should leave out the country, team and qualification that are not announced yet', () => {
    const unannounced = { name: 'TBA', country: 'TBA', race: 'Random', team: '', source: '', image: '/assets/bge/players/tba.png' };
    fixture.destroy();
    fixture = TestBed.createComponent(EventsComponent);
    component = fixture.componentInstance;
    component.invitedPlayers = [unannounced];
    component.qualifiedPlayers = [{ ...unannounced, source: 'Europe Open Qualifier' }];
    component.talent = [{ name: 'TBA', country: 'TBA', role: 'Commentator', image: '/assets/bge/talent/tba.png' }];
    fixture.detectChanges();

    const cards = Array.from<HTMLElement>(fixture.nativeElement.querySelectorAll('.player-card'));
    expect(cards.length).toBe(3);
    cards.forEach(card => {
      expect(card.querySelector('igx-avatar')).toBeNull();
      expect(card.querySelector('.player-card-name').textContent.trim()).toBe('TBA');
    });
    expect(cards[0].querySelector('.player-card-team')).toBeNull();
    expect(cards[0].querySelector('.player-card-source')).toBeNull();
    // A qualified player always shows how they qualified
    expect(cards[1].querySelector('.player-card-source').textContent).toBe('Europe Open Qualifier');
    expect(cards[2].querySelector('.player-card-team').textContent).toBe('Commentator');
  });

  it('should calculate time left correctly', () => {
    // Only Date is faked so the component's countdown interval keeps using real timers.
    vi.useFakeTimers({ toFake: ['Date'] });
    try {
      component.isoDate = '2025-06-04T10:00:00Z';
      component.announcementDate = new Date('2025-06-04T10:00:00Z');
      let mockDate = new Date('2025-06-03T10:00:00Z');
      vi.setSystemTime(mockDate);
      component.timeLeft();
      expect(component.days()).toBe(1);
      expect(component.hours()).toBe(0);
      expect(component.minutes()).toBe(0);
      expect(component.seconds()).toBe(0);

      mockDate = new Date('2025-06-05T10:00:00Z');
      vi.setSystemTime(mockDate);
      // vi.spyOn(component.sub, 'unsubscribe');
      component.timeLeft();
      expect(component.days()).toBe(0);
      expect(component.hours()).toBe(0);
      expect(component.minutes()).toBe(0);
      expect(component.seconds()).toBe(0);
      // expect(component.sub.unsubscribe).toHaveBeenCalled();
    } finally {
      vi.useRealTimers();
    }
  });

  // it('should unsubscribe from interval on destroy', () => {
  //   vi.spyOn(component.sub, 'unsubscribe');
  //   component.ngOnDestroy();
  //   expect(component.sub.unsubscribe).toHaveBeenCalled();
  // });

  it('should link the BGE Balkan Circuit heading with a real link', () => {
    const heading = fixture.nativeElement.querySelector('h2#bgebalkan') as HTMLElement;
    const link = heading.querySelector('a');

    expect(link.textContent.trim()).toBe('BGE Balkan Circuit');
    expect(link.hasAttribute('href')).toBe(true);
    expect(heading.hasAttribute('tabindex')).toBe(false);
  });

  it('should give the venue map a title', () => {
    const map = fixture.nativeElement.querySelector('iframe.venue-map') as HTMLIFrameElement;

    expect(map.title).toBe('Map of the Summer Theater in Stara Zagora');
  });

  it('should scroll to the correct element', () => {
    const elementId = 'test-id';
    const mockElement = document.createElement('div');
    mockElement.id = elementId;
    vi.spyOn(mockElement, 'scrollIntoView').mockImplementation(() => undefined);
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
        EventsComponent
      ],
      providers: [
        provideRouter([]),
        { provide: LOCALE_ID, useValue: 'bg' },
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({})
          }
        }
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
