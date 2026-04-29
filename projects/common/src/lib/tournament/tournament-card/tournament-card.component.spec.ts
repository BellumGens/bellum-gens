import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { TournamentCardComponent } from './tournament-card.component';
import { Tournament, TournamentStatus, TournamentVisibility, Game } from '../../../models/tournament';

describe('TournamentCardComponent', () => {
  let component: TournamentCardComponent;
  let fixture: ComponentFixture<TournamentCardComponent>;

  const mockTournament: Tournament = {
    id: 't1',
    name: 'Test Tournament',
    description: 'A test tournament',
    startDate: new Date('2026-04-01'),
    endDate: new Date('2026-04-15'),
    status: TournamentStatus.Open,
    visibility: TournamentVisibility.Public,
    game: Game.CSGO,
    prizePool: '$1000'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TournamentCardComponent],
      providers: [provideRouter([])]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('tournament', mockTournament);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display tournament name', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Test Tournament');
  });

  it('should return correct status label', () => {
    expect(component.statusLabel).toBe('Open');
  });

  it('should return correct visibility icon', () => {
    expect(component.visibilityIcon).toBe('public');
  });

  it('should return correct game label for CSGO', () => {
    expect(component.gameLabel).toBe('Counter-Strike');
  });

  it('should return correct game label for StarCraft2', () => {
    fixture.componentRef.setInput('tournament', { ...mockTournament, game: Game.StarCraft2 });
    fixture.detectChanges();
    expect(component.gameLabel).toBe('StarCraft II');
  });

  it('should return correct status badge type for each status', () => {
    fixture.componentRef.setInput('tournament', { ...mockTournament, status: TournamentStatus.InProgress });
    expect(component.statusBadgeType).toBe('warning');

    fixture.componentRef.setInput('tournament', { ...mockTournament, status: TournamentStatus.Completed });
    expect(component.statusBadgeType).toBe('info');

    fixture.componentRef.setInput('tournament', { ...mockTournament, status: TournamentStatus.Cancelled });
    expect(component.statusBadgeType).toBe('error');

    fixture.componentRef.setInput('tournament', { ...mockTournament, status: TournamentStatus.Draft });
    expect(component.statusBadgeType).toBe('default');
  });

  it('should return correct visibility icon for each visibility', () => {
    fixture.componentRef.setInput('tournament', { ...mockTournament, visibility: TournamentVisibility.Private });
    expect(component.visibilityIcon).toBe('lock');

    fixture.componentRef.setInput('tournament', { ...mockTournament, visibility: TournamentVisibility.InviteOnly });
    expect(component.visibilityIcon).toBe('mail');
  });

  it('should emit manage event', () => {
    fixture.componentRef.setInput('showManage', true);
    fixture.detectChanges();

    let emitted: Tournament | undefined;
    component.manage.subscribe((t: Tournament) => emitted = t);
    component.manage.emit(mockTournament);
    expect(emitted).toEqual(mockTournament);
  });

  it('should emit deleteTournament event', () => {
    let emitted: Tournament | undefined;
    component.deleteTournament.subscribe((t: Tournament) => emitted = t);
    component.deleteTournament.emit(mockTournament);
    expect(emitted).toEqual(mockTournament);
  });

  it('should default detailRoutePrefix to /tournaments', () => {
    expect(component.detailRoutePrefix()).toBe('/tournaments');
  });

  it('should default showManage to false', () => {
    expect(component.showManage()).toBe(false);
  });
});
