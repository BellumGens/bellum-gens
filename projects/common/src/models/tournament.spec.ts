import { Tournament, TournamentStatus, getTournamentStatus, isUpcomingTournament } from './tournament';

describe('tournament status derivation', () => {
  const now = new Date('2026-06-01T12:00:00Z').getTime();
  const past = '2026-05-01T00:00:00Z';
  const earlierPast = '2026-04-01T00:00:00Z';
  const future = '2026-07-01T00:00:00Z';
  // The API serializes dates as strings
  const tournament = (overrides: Record<string, unknown> = {}) => ({ id: '1', name: 'Tournament', ...overrides }) as Tournament;

  describe('getTournamentStatus', () => {
    it('should keep an explicit status', () => {
      expect(getTournamentStatus(tournament({ status: TournamentStatus.Draft, active: true }), now)).toBe(TournamentStatus.Draft);
      expect(getTournamentStatus(tournament({ status: TournamentStatus.Cancelled, endDate: past }), now)).toBe(TournamentStatus.Cancelled);
      expect(getTournamentStatus(tournament({ status: TournamentStatus.Open, startDate: past }), now)).toBe(TournamentStatus.Open);
    });

    it('should treat an active tournament without a status as in progress', () => {
      expect(getTournamentStatus(tournament({ active: true }), now)).toBe(TournamentStatus.InProgress);
      expect(getTournamentStatus(tournament({ active: true, startDate: earlierPast, endDate: past }), now)).toBe(TournamentStatus.InProgress);
    });

    it('should treat an inactive tournament that has ended as completed', () => {
      expect(getTournamentStatus(tournament({ active: false, startDate: earlierPast, endDate: past }), now)).toBe(TournamentStatus.Completed);
      expect(getTournamentStatus(tournament({ active: false, endDate: past }), now)).toBe(TournamentStatus.Completed);
    });

    it('should treat an inactive tournament that started without an end date as completed', () => {
      expect(getTournamentStatus(tournament({ active: false, startDate: past }), now)).toBe(TournamentStatus.Completed);
    });

    it('should treat an inactive tournament that hasn\'t started as open', () => {
      expect(getTournamentStatus(tournament({ active: false, startDate: future }), now)).toBe(TournamentStatus.Open);
      expect(getTournamentStatus(tournament({ startDate: new Date(future), endDate: new Date('2026-07-02T00:00:00Z') }), now))
        .toBe(TournamentStatus.Open);
    });

    it('should return null when the status can\'t be derived', () => {
      expect(getTournamentStatus(null, now)).toBeNull();
      expect(getTournamentStatus(tournament({ active: false }), now)).toBeNull();
      expect(getTournamentStatus(tournament({ startDate: 'not a date' }), now)).toBeNull();
      // Started, not active, and not ended yet
      expect(getTournamentStatus(tournament({ active: false, startDate: past, endDate: future }), now)).toBeNull();
    });

    it('should default to the current time', () => {
      expect(getTournamentStatus(tournament({ endDate: '2000-01-01T00:00:00Z' }))).toBe(TournamentStatus.Completed);
      expect(getTournamentStatus(tournament({ startDate: '2999-01-01T00:00:00Z' }))).toBe(TournamentStatus.Open);
    });
  });

  describe('isUpcomingTournament', () => {
    it('should include drafts and tournaments without a status that start in the future', () => {
      expect(isUpcomingTournament(tournament({ status: TournamentStatus.Draft, startDate: future }), now)).toBe(true);
      expect(isUpcomingTournament(tournament({ active: false, startDate: future }), now)).toBe(true);
      expect(isUpcomingTournament(tournament({ startDate: future }), now)).toBe(true);
    });

    it('should exclude tournaments that started or have no start date', () => {
      expect(isUpcomingTournament(tournament({ status: TournamentStatus.Draft, startDate: past }), now)).toBe(false);
      expect(isUpcomingTournament(tournament({ status: TournamentStatus.Draft }), now)).toBe(false);
      expect(isUpcomingTournament(tournament({ active: false, startDate: past }), now)).toBe(false);
      expect(isUpcomingTournament(null, now)).toBe(false);
    });

    it('should exclude active tournaments and tournaments with any other explicit status', () => {
      expect(isUpcomingTournament(tournament({ active: true, startDate: future }), now)).toBe(false);
      expect(isUpcomingTournament(tournament({ status: TournamentStatus.Open, startDate: future }), now)).toBe(false);
      expect(isUpcomingTournament(tournament({ status: TournamentStatus.Cancelled, startDate: future }), now)).toBe(false);
    });
  });
});
