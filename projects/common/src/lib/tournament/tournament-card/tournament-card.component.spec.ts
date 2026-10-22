import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { formatDate } from '@angular/common';

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

  const el = (): HTMLElement => fixture.nativeElement;
  const chips = () => Array.from(el().querySelectorAll('igx-chip')).map(c => c.textContent.trim());
  const buttons = () => Array.from(el().querySelectorAll<HTMLButtonElement>('igx-card-actions button'));

  const mediumDate = (date: Date) => formatDate(date, 'mediumDate', 'en-US');

  const render = (tournament: Tournament) => {
    fixture.componentRef.setInput('tournament', tournament);
    fixture.detectChanges();
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
    expect(el().textContent).toContain('Test Tournament');
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
    expect(component.statusBadgeType).toBe('success');

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

  it('should render a status chip with matching label and class for each status', () => {
    const cases: [TournamentStatus, string, string][] = [
      [TournamentStatus.Draft, 'Draft', 'status-draft'],
      [TournamentStatus.Open, 'Open', 'status-open'],
      [TournamentStatus.InProgress, 'In Progress', 'status-in-progress'],
      [TournamentStatus.Completed, 'Completed', 'status-completed'],
      [TournamentStatus.Cancelled, 'Cancelled', 'status-cancelled']
    ];

    for (const [status, label, cssClass] of cases) {
      render({ ...mockTournament, status });

      const statusChip = Array.from(el().querySelectorAll('igx-chip')).find(c => c.textContent.trim() === label);
      expect(statusChip).toBeDefined();
      expect(statusChip.classList).toContain(cssClass);
      expect(el().querySelectorAll('igx-chip[class*="status-"]').length).toBe(1);
    }
  });

  it('should label an unknown status as Unknown without a status class', () => {
    render({ ...mockTournament, status: undefined });

    expect(component.statusLabel).toBe('Unknown');
    expect(chips()).toContain('Unknown');
    expect(el().querySelector('igx-chip[class*="status-"]')).toBeNull();
  });

  it('should fall back to the public visibility when none is set', () => {
    render({ ...mockTournament, visibility: undefined });

    expect(component.visibilityIcon).toBe('public');
    const visibilityChip = el().querySelector('igx-chip');
    expect(visibilityChip.querySelector('igx-icon').textContent.trim()).toBe('public');
    expect(visibilityChip.textContent).toContain('public');
  });

  it('should render the visibility icon and text in the first chip', () => {
    render({ ...mockTournament, visibility: TournamentVisibility.InviteOnly });

    const visibilityChip = el().querySelector('igx-chip');
    expect(visibilityChip.querySelector('igx-icon').textContent.trim()).toBe('mail');
    expect(visibilityChip.textContent).toContain('invite-only');
  });

  it('should render the game chip only for a known game', () => {
    expect(chips().some(c => c.includes('Counter-Strike'))).toBe(true);

    render({ ...mockTournament, game: Game.StarCraft2 });
    expect(chips().some(c => c.includes('StarCraft II'))).toBe(true);

    render({ ...mockTournament, game: undefined });
    expect(component.gameLabel).toBe('');
    expect(el().textContent).not.toContain('sports_esports');
    expect(el().querySelectorAll('igx-chip').length).toBe(2);
  });

  it('should render the logo image when the tournament has a logo', () => {
    render({ ...mockTournament, logo: '/assets/tournament-logo.png' });

    const img: HTMLImageElement = el().querySelector('igx-card-media img');
    expect(img).not.toBeNull();
    expect(img.getAttribute('src')).toContain('/assets/tournament-logo.png');
    expect(img.alt).toBe('Test Tournament');
    expect(el().querySelector('.card-placeholder-media')).toBeNull();
  });

  it('should render a placeholder when the tournament has no logo', () => {
    expect(el().querySelector('igx-card-media img')).toBeNull();
    expect(el().querySelector('.card-placeholder-media igx-icon').textContent.trim()).toBe('emoji_events');
  });

  it('should render start and end dates', () => {
    const meta = el().querySelector('.card-meta');
    expect(meta.textContent).toContain(mediumDate(mockTournament.startDate));
    expect(meta.textContent).toContain(mediumDate(mockTournament.endDate));
  });

  it('should render only the start date when there is no end date', () => {
    render({ ...mockTournament, endDate: undefined });

    const meta = el().querySelector('.card-meta');
    expect(meta.textContent).toContain(mediumDate(mockTournament.startDate));
    expect(meta.querySelector('.meta-item span')).toBeNull();
  });

  it('should not render dates when there is no start date', () => {
    render({ ...mockTournament, startDate: undefined });

    expect(el().querySelector('.card-meta .meta-item')).toBeNull();
  });

  it('should render prize pool and description when present', () => {
    expect(el().querySelector('.prize-amount').textContent.trim()).toBe('$1000');
    expect(el().querySelector('.card-description').textContent.trim()).toBe('A test tournament');

    render({ ...mockTournament, prizePool: undefined, description: undefined });

    expect(el().querySelector('.prize-pool')).toBeNull();
    expect(el().querySelector('.card-description')).toBeNull();
  });

  it('should link to the details page using the route prefix', () => {
    const link: HTMLAnchorElement = el().querySelector('igx-card-actions a');
    expect(link.getAttribute('href')).toBe('/tournaments/t1');

    fixture.componentRef.setInput('detailRoutePrefix', '/tournaments/view');
    fixture.detectChanges();

    expect(link.getAttribute('href')).toBe('/tournaments/view/t1');
  });

  it('should hide manage and delete actions by default', () => {
    expect(buttons().length).toBe(0);
  });

  it('should emit manage when the manage button is clicked', () => {
    fixture.componentRef.setInput('showManage', true);
    fixture.detectChanges();

    let emitted: Tournament | undefined;
    component.manage.subscribe((t: Tournament) => emitted = t);
    const manageButton = buttons().find(b => b.textContent.includes('Manage'));
    manageButton.click();

    expect(emitted).toEqual(mockTournament);
  });

  it('should emit deleteTournament when the delete button is clicked', () => {
    fixture.componentRef.setInput('showManage', true);
    fixture.detectChanges();

    let emitted: Tournament | undefined;
    let managed = false;
    component.deleteTournament.subscribe((t: Tournament) => emitted = t);
    component.manage.subscribe(() => managed = true);
    el().querySelector<HTMLButtonElement>('button.danger-btn').click();

    expect(emitted).toEqual(mockTournament);
    expect(managed).toBe(false);
  });

  it('should default detailRoutePrefix to /tournaments', () => {
    expect(component.detailRoutePrefix()).toBe('/tournaments');
  });

  it('should default showManage to false', () => {
    expect(component.showManage()).toBe(false);
  });
});
