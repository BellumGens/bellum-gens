import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal, WritableSignal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { IDropDroppedEventArgs, IgxDropDirective } from '@infragistics/igniteui-angular/directives';
import { IgxGridComponent } from '@infragistics/igniteui-angular/grids/grid';
import { IRowDataEventArgs } from '@infragistics/igniteui-angular/grids/core';
import { IgxDialogComponent } from '@infragistics/igniteui-angular/dialog';
import { IgxSelectComponent } from '@infragistics/igniteui-angular/select';
import { IgxDatePickerComponent } from '@infragistics/igniteui-angular/date-picker';
import { IgxTimePickerComponent } from '@infragistics/igniteui-angular/time-picker';
import { config, of, throwError } from 'rxjs';

import { AdminDota2Component } from './admin-dota2.component';
import { ApiTournamentsService } from 'bellum-gens-common/services';
import {
  CSGOTeam,
  Tournament,
  TournamentApplicationState,
  TournamentDota2Match,
  TournamentDota2MatchGame,
  TournamentGroup,
  TournamentParticipant
} from 'bellum-gens-common/models';
import { ConfirmComponent } from 'bellum-gens-common';

const team = (teamId: string, teamName: string): CSGOTeam => ({
  teamId,
  teamName,
  teamAvatar: '',
  visible: true,
  customUrl: teamId
});

const participant = (id: string, teamName: string, overrides: Partial<TournamentParticipant> = {}): TournamentParticipant => ({
  id,
  userId: `user-${id}`,
  teamId: `team-${id}`,
  team: team(`team-${id}`, teamName),
  state: TournamentApplicationState.Confirmed,
  companyId: 'Infragistics',
  ...overrides
});

const TOURNAMENTS: Tournament [] = [
  { id: 't1', name: 'Spring Cup' },
  { id: 't2', name: 'Autumn Cup' }
];

describe('AdminDota2Component', () => {
  let component: AdminDota2Component;
  let fixture: ComponentFixture<AdminDota2Component>;
  let apiService: ApiTournamentsService;
  let registrations: WritableSignal<TournamentParticipant [] | null>;
  let groups: WritableSignal<TournamentGroup [] | null>;
  let matches: WritableSignal<TournamentDota2Match [] | null>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, AdminDota2Component],
      providers: [provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
    }).compileComponents();

    apiService = TestBed.inject(ApiTournamentsService);
    // the service's own state; its lazy getter hands it out read-only without fetching
    apiService['_tournaments'].set(TOURNAMENTS);

    registrations = signal<TournamentParticipant [] | null>(null);
    groups = signal<TournamentGroup [] | null>(null);
    matches = signal<TournamentDota2Match [] | null>(null);
    vi.spyOn(apiService, 'getDota2Registrations').mockReturnValue(registrations);
    vi.spyOn(apiService, 'getDota2Groups').mockReturnValue(groups);
    vi.spyOn(apiService, 'getDota2Matches').mockReturnValue(matches);
  });

  const create = () => {
    fixture = TestBed.createComponent(AdminDota2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  const el = (): HTMLElement => fixture.nativeElement;
  const unassigned = () => Array.from(el().querySelectorAll('.registration-slot a')).map(a => a.textContent.trim());
  const groupCards = () => Array.from(el().querySelectorAll<HTMLElement>('.card-wrapper > igx-card:not(.new-group-card)'));
  const groupMembers = (card: HTMLElement) =>
    Array.from(card.querySelectorAll('igx-list-item a')).map(a => a.textContent.trim());
  // The icon actions are buttons, found by their accessible name
  const named = (root: Element, label: string) => root.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`);

  // The component leaves error reporting to the service, so RxJS reports the rethrown error from a timer
  const expectUnhandledError = async (action: () => void) => {
    const unhandled = vi.fn();
    config.onUnhandledError = unhandled;
    try {
      action();
      await new Promise(resolve => setTimeout(resolve));
    } finally {
      config.onUnhandledError = null;
    }
    expect(unhandled).toHaveBeenCalledWith(expect.objectContaining({ message: 'nope' }));
  };

  const selectFirstTournament = () => {
    component.selectTournament(TOURNAMENTS[0]);
    fixture.detectChanges();
  };

  describe('without a selected tournament', () => {
    it('lists the tournaments and loads nothing tournament specific', () => {
      create();

      expect(component.tournaments()).toEqual(TOURNAMENTS);
      expect(component.registrations()).toBeNull();
      expect(component.unassigned()).toBeNull();
      expect(component.groups()).toBeNull();
      expect(component.matches()).toBeNull();
      expect(apiService.getDota2Registrations).not.toHaveBeenCalled();
      expect(apiService.getDota2Groups).not.toHaveBeenCalled();
      expect(apiService.getDota2Matches).not.toHaveBeenCalled();
      expect(el().querySelector('h1[igxCardHeaderTitle]')!.textContent).toContain('No Participants');
      expect(el().querySelector('igx-grid-toolbar-title')!.textContent).toContain('No Dota 2 series');
      expect(el().querySelectorAll('.registration-slot').length).toBe(0);
      expect(groupCards().length).toBe(0);
    });

    it('shows the new group card with the Dota 2 icon', () => {
      create();

      const newGroupCard = el().querySelector('.new-group-card')!;
      expect(newGroupCard.textContent).toContain('New group');
      expect(named(newGroupCard, 'New group')).toBeTruthy();
      expect(newGroupCard.querySelector('igx-avatar')!.getAttribute('src')).toBe('/assets/wallpapers/dota2-icon.png');
    });
  });

  describe('selecting a tournament', () => {
    it('reads the registrations, groups and series of the selected tournament', () => {
      create();
      registrations.set([participant('p1', 'Alpha')]);
      groups.set([{ id: 'g1', name: 'Group A', participants: [] }]);
      matches.set([]);

      selectFirstTournament();

      expect(component.selectedTournament()).toBe(TOURNAMENTS[0]);
      expect(apiService.getDota2Registrations).toHaveBeenCalledWith('t1');
      expect(apiService.getDota2Groups).toHaveBeenCalledWith('t1');
      expect(apiService.getDota2Matches).toHaveBeenCalledWith('t1');
      expect(component.registrations()).toEqual([participant('p1', 'Alpha')]);
      expect(component.groups()!.map(g => g.name)).toEqual(['Group A']);
      expect(component.matches()).toEqual([]);
      expect(el().querySelector('h1[igxCardHeaderTitle]')!.textContent).toContain('Spring Cup Participants');
    });

    it('selects a tournament from the tournament dropdown', async () => {
      registrations.set([participant('p1', 'Alpha')]);
      create();
      const select = fixture.debugElement.query(By.directive(IgxSelectComponent)).componentInstance as IgxSelectComponent;
      expect(select.items.map(i => i.value)).toEqual(TOURNAMENTS);

      select.selectItem(select.items[1]);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.selectedTournament()).toBe(TOURNAMENTS[1]);
      expect(apiService.getDota2Registrations).toHaveBeenCalledWith('t2');
      expect(el().querySelector('h1[igxCardHeaderTitle]')!.textContent).toContain('Autumn Cup Participants');
      expect(el().querySelector('igx-grid-toolbar-title')!.textContent).toContain('Autumn Cup Dota 2 series');
      expect(unassigned()).toEqual(['Alpha']);
    });

    it('re-renders when the service cache for the tournament updates', () => {
      create();
      selectFirstTournament();
      expect(unassigned()).toEqual([]);

      registrations.set([participant('p1', 'Alpha'), participant('p2', 'Bravo')]);
      fixture.detectChanges();

      expect(unassigned()).toEqual(['Alpha', 'Bravo']);
    });
  });

  describe('loading state', () => {
    it('shows a progress indicator while the registrations are loading', () => {
      apiService['_loadingDota2Registrations'].set(true);
      create();

      expect(component.loading()).toBe(true);
      expect(el().querySelector('.registration-container igx-circular-bar')).not.toBeNull();

      apiService['_loadingDota2Registrations'].set(false);
      fixture.detectChanges();

      expect(el().querySelector('.registration-container igx-circular-bar')).toBeNull();
    });

    it('marks the series grid as loading while the series load', () => {
      create();
      const matchGrid = fixture.debugElement.query(By.directive(IgxGridComponent)).componentInstance as IgxGridComponent;
      expect(component.loadingMatches()).toBe(false);
      expect(matchGrid.isLoading).toBe(false);

      apiService['_loadingDota2Matches'].set(true);
      fixture.detectChanges();

      expect(component.loadingMatches()).toBe(true);
      expect(matchGrid.isLoading).toBe(true);
    });
  });

  describe('unassigned teams', () => {
    it('lists only the registered teams that no group lists', () => {
      registrations.set([participant('p1', 'Alpha'), participant('p2', 'Bravo'), participant('p3', 'Charlie')]);
      // The groups list their own copies of the participants
      groups.set([{ id: 'g1', name: 'Group A', participants: [{ ...participant('p2', 'Bravo') }] }]);
      create();
      selectFirstTournament();

      expect(unassigned()).toEqual(['Alpha', 'Charlie']);
    });

    it('flags registrations that are pending check-in', () => {
      registrations.set([
        participant('p1', 'Alpha', { state: TournamentApplicationState.Pending }),
        participant('p2', 'Bravo')
      ]);
      create();
      selectFirstTournament();

      const slots = el().querySelectorAll('.registration-slot');
      expect(slots[0].querySelector('igx-badge')).not.toBeNull();
      expect(slots[1].querySelector('igx-badge')).toBeNull();
    });
  });

  describe('groups', () => {
    let alpha: TournamentParticipant;
    let bravo: TournamentParticipant;
    let groupA: TournamentGroup;

    beforeEach(() => {
      alpha = participant('p1', 'Alpha');
      bravo = participant('p2', 'Bravo');
      groupA = { id: 'g1', name: 'Group A', participants: [bravo] };
      registrations.set([alpha, bravo]);
      groups.set([groupA]);
      vi.spyOn(apiService, 'addParticipantToGroup').mockReturnValue(of({}));
      vi.spyOn(apiService, 'removeParticipantFromGroup').mockReturnValue(of({}));
      create();
      selectFirstTournament();
    });

    it('renders each group with its teams', () => {
      const cards = groupCards();
      expect(cards.length).toBe(1);
      expect(cards[0].querySelector('h1')!.textContent.trim()).toBe('Group A');
      expect(groupMembers(cards[0])).toEqual(['Bravo']);
      expect(unassigned()).toEqual(['Alpha']);
    });

    it('exposes the group actions as named buttons', () => {
      const card = groupCards()[0];
      const labels = (root: Element) => Array.from(root.querySelectorAll('button')).map(b => b.getAttribute('aria-label'));

      expect(labels(card.querySelector('.action-buttons')!)).toEqual(['Edit group', 'Delete group']);
      expect(named(card.querySelector('igx-list-item')!, 'Remove from group')!.type).toBe('button');

      named(card, 'Edit group')!.click();
      fixture.detectChanges();

      expect(labels(card.querySelector('.action-buttons')!)).toEqual(['Cancel', 'Save group']);
    });

    it('moves a dropped team from the unassigned list into the group', () => {
      const trigger = component.groupsTrigger();

      const drop = fixture.debugElement.query(By.css('igx-list.group-list')).injector.get(IgxDropDirective);
      drop.dropped.emit({ dragData: alpha } as IDropDroppedEventArgs);
      fixture.detectChanges();

      expect(apiService.addParticipantToGroup).toHaveBeenCalledWith(alpha, 'g1');
      expect(component.groupsTrigger()).toBe(trigger + 1);
      expect(unassigned()).toEqual([]);
      expect(groupMembers(groupCards()[0])).toEqual(['Bravo', 'Alpha']);
    });

    it('starts the participant list of a group that had none', () => {
      const empty: TournamentGroup = { id: 'g2', name: 'Group B' };

      component.addToGroup({ dragData: alpha } as IDropDroppedEventArgs, empty);

      expect(empty.participants).toEqual([alpha]);
    });

    it('ignores a drop on a group that has not been saved yet', () => {
      component.addToGroup({ dragData: alpha } as IDropDroppedEventArgs, { name: 'Unsaved' });

      expect(apiService.addParticipantToGroup).not.toHaveBeenCalled();
    });

    it('returns a removed team to the unassigned list once the server confirms', () => {
      const trigger = component.groupsTrigger();

      named(groupCards()[0].querySelector('igx-list-item')!, 'Remove from group')!.click();
      fixture.detectChanges();

      expect(apiService.removeParticipantFromGroup).toHaveBeenCalledWith('p2', 'g1');
      expect(groupA.participants).toEqual([]);
      expect(component.groupsTrigger()).toBe(trigger + 1);
      expect(unassigned()).toEqual(['Alpha', 'Bravo']);
      expect(groupMembers(groupCards()[0])).toEqual([]);
    });

    it('keeps the team in the group when the removal fails', async () => {
      vi.mocked(apiService.removeParticipantFromGroup).mockReturnValue(throwError(() => new Error('nope')));
      const trigger = component.groupsTrigger();

      await expectUnhandledError(() => component.removeFromGroup(bravo, groupA));
      fixture.detectChanges();

      expect(groupA.participants).toEqual([bravo]);
      expect(component.groupsTrigger()).toBe(trigger);
      expect(unassigned()).toEqual(['Alpha']);
    });

    it('edits a group name inline and submits it as a Dota 2 group of the selected tournament', () => {
      const submit = vi.spyOn(apiService, 'submitDota2Group').mockReturnValue(of(groupA));
      const card = groupCards()[0];

      named(card, 'Edit group')!.click();
      fixture.detectChanges();
      expect(groupA.inEdit).toBe(true);
      const input = card.querySelector<HTMLInputElement>('input#groupNameg1')!;
      expect(input.closest('igx-input-group')!.querySelector('label')!.htmlFor).toBe('groupNameg1');
      input.value = 'Group Alpha';
      input.dispatchEvent(new Event('input'));

      named(card, 'Save group')!.click();
      fixture.detectChanges();

      expect(submit).toHaveBeenCalledWith(groupA, 't1');
      expect(groupA.name).toBe('Group Alpha');
      expect(groupA.inEdit).toBe(false);
      expect(card.querySelector('h1')!.textContent.trim()).toBe('Group Alpha');
    });

    it('cancels editing a group without submitting', () => {
      const submit = vi.spyOn(apiService, 'submitDota2Group');
      const card = groupCards()[0];

      named(card, 'Edit group')!.click();
      fixture.detectChanges();
      named(card, 'Cancel')!.click();
      fixture.detectChanges();

      expect(groupA.inEdit).toBe(false);
      expect(submit).not.toHaveBeenCalled();
    });

    it('creates a new group for the selected tournament and relies on the service cache to show it', () => {
      const created: TournamentGroup = { id: 'g2', name: 'Group B', participants: [] };
      const submit = vi.spyOn(apiService, 'submitDota2Group').mockImplementation(() => {
        groups.update(list => [...list!, created]);
        return of(created);
      });
      const newGroupCard = el().querySelector('.new-group-card')!;

      named(newGroupCard, 'New group')!.click();
      fixture.detectChanges();
      expect(component.newGroup.inEdit).toBe(true);
      component.newGroup.name = 'Group B';

      const submitButton = Array.from(newGroupCard.querySelectorAll('button')).find(b => b.textContent.trim() === 'Submit');
      submitButton!.click();
      fixture.detectChanges();

      expect(submit).toHaveBeenCalledWith(expect.objectContaining({ name: 'Group B' }), 't1');
      expect(component.newGroup.inEdit).toBe(false);
      expect(component.newGroup.name).toBeFalsy();
      expect(groupCards().map(c => c.querySelector('h1')!.textContent.trim())).toEqual(['Group A', 'Group B']);
    });

    it('deletes a confirmed group and unassigns its teams once the service cache drops it', () => {
      const remove = vi.spyOn(apiService, 'deleteGroup').mockImplementation(() => {
        groups.set([]);
        return of(groupA);
      });
      const confirmGroup = fixture.debugElement.queryAll(By.directive(ConfirmComponent))[0].componentInstance as ConfirmComponent;

      confirmGroup.ok.emit('g1');
      fixture.detectChanges();

      expect(remove).toHaveBeenCalledWith('g1');
      expect(groupCards().length).toBe(0);
      expect(unassigned()).toEqual(['Alpha', 'Bravo']);
    });

    it('keeps the group and its teams when the deletion fails', async () => {
      vi.spyOn(apiService, 'deleteGroup').mockReturnValue(throwError(() => new Error('nope')));

      await expectUnhandledError(() => component.deleteGroup('g1'));
      fixture.detectChanges();

      expect(groupCards().length).toBe(1);
      expect(unassigned()).toEqual(['Alpha']);
    });
  });

  describe('series', () => {
    const grid = () => ({ addRow: vi.fn(), updateRow: vi.fn() }) as unknown as IgxGridComponent & {
      addRow: ReturnType<typeof vi.fn>;
      updateRow: ReturnType<typeof vi.fn>;
    };

    beforeEach(() => create());

    it('does not submit a series without both teams', () => {
      const submit = vi.spyOn(apiService, 'submitDota2Match');
      const matchGrid = grid();

      component.matchInEdit = { team1Id: 'team-p1' };
      component.submitMatch(matchGrid);
      component.matchInEdit = { team2Id: 'team-p2' };
      component.submitMatch(matchGrid);

      expect(submit).not.toHaveBeenCalled();
      expect(matchGrid.addRow).not.toHaveBeenCalled();
    });

    it('adds a newly created series to the grid with a Date start time', () => {
      const saved = { id: 'm1', team1Id: 'team-p1', team2Id: 'team-p2', startTime: '2026-10-01T18:00:00Z' as unknown as Date };
      const submit = vi.spyOn(apiService, 'submitDota2Match').mockReturnValue(of(saved));
      const matchGrid = grid();
      component.matchInEdit = { team1Id: 'team-p1', team2Id: 'team-p2' };

      component.submitMatch(matchGrid);

      expect(submit).toHaveBeenCalledWith({ team1Id: 'team-p1', team2Id: 'team-p2' });
      expect(matchGrid.addRow).toHaveBeenCalledWith(saved);
      expect(matchGrid.updateRow).not.toHaveBeenCalled();
      expect(saved.startTime).toBeInstanceOf(Date);
      expect(saved.startTime.toISOString()).toBe('2026-10-01T18:00:00.000Z');
    });

    it('updates the winner and the saved games of an existing series in its row', () => {
      const games: TournamentDota2MatchGame [] = [{ id: 'gm1', dota2MatchId: 'm1', gameNumber: 1, winnerTeamId: 'team-p1' }];
      vi.spyOn(apiService, 'submitDota2Match').mockReturnValue(of({ id: 'm1', winnerTeamId: 'team-p1', games }));
      const matchGrid = grid();
      component.matchInEdit = {
        id: 'm1', team1Id: 'team-p1', team2Id: 'team-p2', team1Points: 1, team2Points: 0,
        games: [{ dota2MatchId: 'm1', gameNumber: 1, winnerTeamId: 'team-p1' }]
      };

      component.submitMatch(matchGrid);

      expect(matchGrid.addRow).not.toHaveBeenCalled();
      // The games come back with their ids, so submitting again doesn't add them twice
      expect(matchGrid.updateRow).toHaveBeenCalledWith({ winnerTeamId: 'team-p1', games }, 'm1');
    });

    it('does not touch the grid when the server returns nothing', () => {
      vi.spyOn(apiService, 'submitDota2Match').mockReturnValue(of(null as unknown as TournamentDota2Match));
      const matchGrid = grid();
      component.matchInEdit = { team1Id: 'team-p1', team2Id: 'team-p2' };

      component.submitMatch(matchGrid);

      expect(matchGrid.addRow).not.toHaveBeenCalled();
      expect(matchGrid.updateRow).not.toHaveBeenCalled();
    });

    it('deletes a series removed from the grid', () => {
      const remove = vi.spyOn(apiService, 'deleteDota2Match').mockReturnValue(of({ id: 'm1' }));
      const match: TournamentDota2Match = { id: 'm1' };

      component.deleteMatch({ data: match } as IRowDataEventArgs);

      expect(remove).toHaveBeenCalledWith(match);
    });

    it('starts a fresh series for the new series dialog', () => {
      component.matchInEdit = { id: 'm1', team1Id: 'team-p1' };

      component.addNewMatch();

      expect(component.matchInEdit.id).toBeUndefined();
      expect(component.matchInEdit.team1Id).toBeUndefined();
      expect(component.matchInEdit.startTime).toBeInstanceOf(Date);
    });

    it('opens a series for editing with a Date start time', () => {
      const dialog = { open: vi.fn() } as unknown as IgxDialogComponent;
      const match: TournamentDota2Match = { id: 'm1', startTime: '2026-10-01T18:00:00Z' as unknown as Date };

      component.editMatch(match, dialog);

      expect(component.matchInEdit).toBe(match);
      expect(match.startTime).toBeInstanceOf(Date);
      expect(dialog.open).toHaveBeenCalled();
    });

    it('numbers each added game after the last game of the series', () => {
      component.matchInEdit = { id: 'm1', team1Id: 'team-p1', team2Id: 'team-p2' };

      component.addGame();
      expect(component.matchInEdit.games).toEqual([
        { dota2MatchId: 'm1', gameNumber: 1, radiantTeamId: null, winnerTeamId: null, steamMatchId: null }
      ]);

      component.matchInEdit.games = [{ id: 'gm3', dota2MatchId: 'm1', gameNumber: 3 }, { id: 'gm1', dota2MatchId: 'm1', gameNumber: 1 }];
      component.addGame();
      expect(component.matchInEdit.games.map(g => g.gameNumber)).toEqual([3, 1, 4]);
    });

    it('drops an unsaved game without calling the server', () => {
      const remove = vi.spyOn(apiService, 'deleteDota2MatchGame');
      const unsaved: TournamentDota2MatchGame = { dota2MatchId: 'm1', gameNumber: 2 };
      const saved: TournamentDota2MatchGame = { id: 'gm1', dota2MatchId: 'm1', gameNumber: 1 };
      component.matchInEdit = { id: 'm1', games: [saved, unsaved] };

      component.deleteGame(unsaved);

      expect(remove).not.toHaveBeenCalled();
      expect(component.matchInEdit.games).toEqual([saved]);
    });

    it('removes a deleted game from the series being edited and marks the view for check', () => {
      const saved: TournamentDota2MatchGame = { id: 'gm1', dota2MatchId: 'm1', gameNumber: 1 };
      const remove = vi.spyOn(apiService, 'deleteDota2MatchGame').mockReturnValue(of(saved));
      const markForCheck = vi.spyOn(component['cdr'], 'markForCheck');
      const match: TournamentDota2Match = { id: 'm1', games: [saved] };
      component.matchInEdit = match;

      component.deleteGame(saved);

      expect(remove).toHaveBeenCalledWith('gm1');
      expect(match.games).toEqual([]);
      expect(markForCheck).toHaveBeenCalled();
    });

    it('keeps the game when deleting it fails', async () => {
      const saved: TournamentDota2MatchGame = { id: 'gm1', dota2MatchId: 'm1', gameNumber: 1 };
      vi.spyOn(apiService, 'deleteDota2MatchGame').mockReturnValue(throwError(() => new Error('nope')));
      component.matchInEdit = { id: 'm1', games: [saved] };

      await expectUnhandledError(() => component.deleteGame(saved));

      expect(component.matchInEdit.games).toEqual([saved]);
    });
  });

  describe('series grid', () => {
    let alpha: TournamentParticipant;
    let bravo: TournamentParticipant;
    let played: TournamentDota2Match;
    let walkover: TournamentDota2Match;
    let upcoming: TournamentDota2Match;

    const render = async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
    };
    const matchGrid = () => fixture.debugElement.query(By.directive(IgxGridComponent)).componentInstance as IgxGridComponent;
    const rows = () => Array.from(el().querySelectorAll('igx-grid-row'));
    const dialog = (title: string) => fixture.debugElement.queryAll(By.directive(IgxDialogComponent))
      .map(d => d.componentInstance as IgxDialogComponent)
      .find(d => d.title === title)!;
    const dialogContent = (target: IgxDialogComponent) => target.toggleRef.element as HTMLElement;
    const confirmMatch = () =>
      fixture.debugElement.queryAll(By.directive(ConfirmComponent))[1].componentInstance as ConfirmComponent;
    const dialogButton = (target: IgxDialogComponent, label: string) =>
      Array.from(dialogContent(target).querySelectorAll<HTMLButtonElement>('.igx-dialog__window-actions button'))
        .find(b => b.textContent.trim() === label);
    const contentButton = (target: IgxDialogComponent, label: string) =>
      Array.from(dialogContent(target).querySelectorAll<HTMLButtonElement>('.igx-dialog__window-content button'))
        .filter(b => b.textContent.includes(label));
    const rowAction = (row: Element, label: string) => named(row.querySelector('.match-actions')!, label);
    const selectsIn = (target: IgxDialogComponent) => fixture.debugElement.queryAll(By.directive(IgxSelectComponent))
      .filter(d => dialogContent(target).contains(d.nativeElement))
      .map(d => d.componentInstance as IgxSelectComponent);
    const typeInto = (input: HTMLInputElement, value: string) => {
      input.value = value;
      input.dispatchEvent(new Event('input'));
    };
    const newSeriesButton = () => Array.from(el().querySelectorAll<HTMLButtonElement>('igx-grid-toolbar button'))
      .find(b => b.textContent.includes('New series'))!;

    beforeEach(async () => {
      alpha = participant('p1', 'Alpha');
      bravo = participant('p2', 'Bravo');
      played = {
        id: 'm1', team1Id: 'team-p1', team2Id: 'team-p2', team1: alpha.team, team2: bravo.team, team1Points: 2, team2Points: 1,
        winnerTeamId: 'team-p1', startTime: new Date(2026, 9, 1, 18, 30), videoLink: 'https://video/1', demoLink: 'https://demo/1',
        games: [
          { id: 'gm2', dota2MatchId: 'm1', gameNumber: 2, radiantTeamId: 'team-p2', winnerTeamId: 'team-p2', steamMatchId: null },
          { id: 'gm1', dota2MatchId: 'm1', gameNumber: 1, radiantTeamId: 'team-p1', winnerTeamId: 'team-p1', steamMatchId: 7300000001 }
        ]
      };
      walkover = {
        id: 'm2', team1Id: 'team-p2', team2Id: 'team-p1', team1: bravo.team, team2: alpha.team, winnerTeamId: 'team-p1',
        startTime: new Date(2026, 9, 2, 18, 30), noShow: true, games: []
      };
      upcoming = {
        id: 'm3', team1Id: 'team-p1', team2Id: 'team-p2', team1: alpha.team, team2: bravo.team,
        startTime: new Date(2026, 9, 3, 18, 30)
      };
      registrations.set([alpha, bravo]);
      groups.set([{ id: 'g1', name: 'Group A', participants: [] }]);
      matches.set([played, walkover, upcoming]);
      create();
      selectFirstTournament();
      await render();
    });

    afterEach(() => {
      fixture.debugElement.queryAll(By.directive(IgxDialogComponent))
        .map(d => d.componentInstance as IgxDialogComponent)
        .filter(d => d.isOpen)
        .forEach(d => d.close());
    });

    it('exposes the row actions as named buttons', () => {
      const actions = Array.from(rows()[0].querySelectorAll<HTMLButtonElement>('.match-actions button'));

      expect(actions.map(b => b.getAttribute('aria-label'))).toEqual(['Add results', 'Edit series', 'Delete series']);
      actions.forEach(b => expect(b.type).toBe('button'));
    });

    it('renders a row per series with the teams, the series score, the winner, media links and start time', () => {
      expect(el().querySelector('igx-grid-toolbar-title')!.textContent).toContain('Spring Cup Dota 2 series');
      expect(rows().length).toBe(3);

      const teamLinks = (row: Element) => Array.from(row.querySelectorAll<HTMLAnchorElement>('a.grid-team-name'));
      expect(teamLinks(rows()[0]).map(a => a.textContent.trim())).toEqual(['Alpha', 'Bravo']);
      expect(teamLinks(rows()[0]).map(a => a.classList.contains('highlight'))).toEqual([true, false]);
      expect(teamLinks(rows()[1]).map(a => a.classList.contains('highlight'))).toEqual([false, true]);
      expect(teamLinks(rows()[2]).map(a => a.classList.contains('highlight'))).toEqual([false, false]);
      expect(teamLinks(rows()[0])[1].getAttribute('href')).toBe(`${component.environment.bellumgens}/team/team-p2`);
      expect(rows().map(row => row.querySelector('.series-score')!.textContent.trim())).toEqual(['2 : 1', '0 : 0', '0 : 0']);

      const mediaLinks = (row: Element) => Array.from(row.querySelectorAll<HTMLAnchorElement>('a.horizontal-center'))
        .map(a => a.getAttribute('href'));
      expect(mediaLinks(rows()[0])).toEqual(['https://video/1', 'https://demo/1']);
      expect(mediaLinks(rows()[1])).toEqual([]);
      expect(rows()[1].textContent).toContain('No video');
      expect(rows()[1].textContent).toContain('No replay');
      expect(rows()[0].textContent).toContain('Oct 1, 2026, 6:30 PM');
    });

    it('shows the games, walkovers and unplayed series in the row details', async () => {
      matchGrid().expandAll();
      await render();

      const details = Array.from(el().querySelectorAll('.igx-grid__tr-container'));
      expect(details.length).toBe(3);
      const gameRows = Array.from(details[0].querySelectorAll('table.series-games tbody tr'))
        .map(tr => Array.from(tr.querySelectorAll('td')).map(td => td.textContent.trim()));
      expect(gameRows).toEqual([
        ['1', 'Alpha', 'Bravo', 'Alpha', '7300000001'],
        ['2', 'Bravo', 'Alpha', 'Bravo', '']
      ]);
      const text = details.map(d => d.textContent.replace(/\s+/g, ' ').trim());
      expect(text[1]).toContain('Walkover');
      expect(text[1]).not.toContain('The match has not been played yet');
      expect(text[2]).toContain('The match has not been played yet');
    });

    it('edits the series score and the games of a series in the results dialog', async () => {
      const submit = vi.spyOn(apiService, 'submitDota2Match').mockReturnValue(of(played));
      const results = dialog('Results');

      rowAction(rows()[0], 'Add results')!.click();
      await render();

      expect(results.isOpen).toBe(true);
      expect(component.matchInEdit).toBe(played);
      const content = dialogContent(results);
      const labels = Array.from(content.querySelectorAll('label')).map(l => l.textContent.trim());
      expect(labels).toEqual(expect.arrayContaining(['Games won Alpha', 'Games won Bravo', 'Game number', 'Radiant', 'Winner', 'Steam match ID']));
      expect(Array.from(content.querySelectorAll('legend')).map(l => l.textContent.trim())).toEqual(['Game 2', 'Game 1']);
      // Every input is labelled by its own label
      content.querySelectorAll<HTMLInputElement>('input[type="number"]').forEach(input => {
        expect(content.querySelector(`label[for="${input.id}"]`)).not.toBeNull();
      });
      // A series with games can't also be a walkover
      expect(content.querySelector('igx-checkbox')).toBeNull();
      expect(content.querySelector('igx-hint')!.textContent.trim()).toBe('Dire: Alpha');

      const [team1Points, team2Points, game2Number, game2SteamId] = Array.from(content.querySelectorAll<HTMLInputElement>('input[type="number"]'));
      typeInto(team1Points, '1');
      typeInto(team2Points, '1');
      typeInto(game2Number, '2');
      typeInto(game2SteamId, '7300000002');
      const [game2Radiant, game2Winner] = selectsIn(results);
      expect(game2Radiant.items.map(i => i.value)).toEqual(['team-p1', 'team-p2']);
      expect(game2Winner.items.map(i => i.value)).toEqual(['team-p1', 'team-p2']);
      game2Radiant.selectItem(game2Radiant.items[0]);
      game2Winner.selectItem(game2Winner.items[0]);
      await render();

      dialogButton(results, 'Submit')!.click();
      await render();

      expect(submit).toHaveBeenCalledWith(played);
      expect(results.isOpen).toBe(false);
      expect(played.team1Points).toBe(1);
      expect(played.team2Points).toBe(1);
      expect(played.games![0]).toEqual(expect.objectContaining({
        id: 'gm2', gameNumber: 2, radiantTeamId: 'team-p1', winnerTeamId: 'team-p1', steamMatchId: 7300000002
      }));
      // an existing series is updated in place rather than added again
      expect(rows().length).toBe(3);
    });

    it('adds games to a series that has none and deletes them again', async () => {
      const remove = vi.spyOn(apiService, 'deleteDota2MatchGame');
      const results = dialog('Results');
      rowAction(rows()[2], 'Add results')!.click();
      await render();

      // no games are recorded yet, so the walkover checkbox is offered
      expect(dialogContent(results).querySelector('igx-checkbox')).not.toBeNull();
      contentButton(results, 'Add a game')[0].click();
      await render();
      contentButton(results, 'Add a game')[0].click();
      await render();

      expect(upcoming.games!.map(g => g.gameNumber)).toEqual([1, 2]);
      expect(Array.from(dialogContent(results).querySelectorAll('legend')).map(l => l.textContent.trim())).toEqual(['Game 1', 'Game 2']);
      expect(dialogContent(results).querySelector('igx-checkbox')).toBeNull();

      contentButton(results, 'Delete game 1')[0].click();
      await render();

      expect(remove).not.toHaveBeenCalled();
      expect(upcoming.games!.map(g => g.gameNumber)).toEqual([2]);
    });

    it('marks a series without games as a walkover', async () => {
      const results = dialog('Results');
      rowAction(rows()[2], 'Add results')!.click();
      await render();

      dialogContent(results).querySelector<HTMLInputElement>('igx-checkbox input')!.click();
      fixture.detectChanges();

      expect(upcoming.noShow).toBe(true);
    });

    it('closes the results dialog on cancel without submitting', async () => {
      const submit = vi.spyOn(apiService, 'submitDota2Match');
      const results = dialog('Results');

      rowAction(rows()[2], 'Add results')!.click();
      await render();
      dialogButton(results, 'Cancel')!.click();
      await render();

      expect(results.isOpen).toBe(false);
      expect(submit).not.toHaveBeenCalled();
    });

    it('opens a row for editing in the series dialog and cancels it', async () => {
      const submit = vi.spyOn(apiService, 'submitDota2Match');
      const seriesDialog = dialog('Series');

      rowAction(rows()[1], 'Edit series')!.click();
      await render();

      expect(seriesDialog.isOpen).toBe(true);
      expect(component.matchInEdit).toBe(walkover);

      dialogButton(seriesDialog, 'Cancel')!.click();
      await render();

      expect(seriesDialog.isOpen).toBe(false);
      expect(submit).not.toHaveBeenCalled();
    });

    it('deletes a series row after confirmation', async () => {
      const remove = vi.spyOn(apiService, 'deleteDota2Match').mockReturnValue(of(walkover));
      const confirm = confirmMatch().dialog();

      rowAction(rows()[1], 'Delete series')!.click();
      await render();
      expect(confirm.isOpen).toBe(true);

      dialogButton(confirm, 'OK')!.click();
      await render();

      expect(remove).toHaveBeenCalledWith(walkover);
      expect(confirm.isOpen).toBe(false);
      expect(rows().length).toBe(2);
    });

    it('fills in a new series from the dialog form and adds it to the grid', async () => {
      const saved: TournamentDota2Match = {
        id: 'm4', team1Id: 'team-p2', team2Id: 'team-p1', team1: bravo.team, team2: alpha.team, games: [],
        startTime: '2026-10-04T18:30:00' as unknown as Date
      };
      const submit = vi.spyOn(apiService, 'submitDota2Match').mockReturnValue(of(saved));
      const seriesDialog = dialog('Series');
      component.matchInEdit = played;

      newSeriesButton().click();
      await render();

      expect(seriesDialog.isOpen).toBe(true);
      expect(component.matchInEdit).not.toBe(played);
      expect(component.matchInEdit.id).toBeUndefined();

      const [groupSelect, team1Select, team2Select] = selectsIn(seriesDialog);
      expect(groupSelect.items.map(i => i.value)).toEqual(['g1']);
      expect(team1Select.items.map(i => i.value)).toEqual(['team-p1', 'team-p2']);
      expect(team2Select.items.map(i => i.value)).toEqual(['team-p1', 'team-p2']);
      groupSelect.selectItem(groupSelect.items[0]);
      team1Select.selectItem(team1Select.items[1]);
      team2Select.selectItem(team2Select.items[0]);

      fixture.debugElement.query(By.directive(IgxDatePickerComponent)).injector.get(IgxDatePickerComponent)
        .select(new Date(2026, 9, 4));
      fixture.debugElement.query(By.directive(IgxTimePickerComponent)).injector.get(IgxTimePickerComponent)
        .select(new Date(2026, 9, 4, 18, 30));
      expect(component.matchInEdit.startTime!.getDate()).toBe(4);
      expect(component.matchInEdit.startTime!.getHours()).toBe(18);

      const [videoInput, replayInput] = Array.from(dialogContent(seriesDialog).querySelectorAll<HTMLInputElement>('input[type="url"]'));
      expect(dialogContent(seriesDialog).querySelector(`label[for="${replayInput.id}"]`)!.textContent.trim()).toBe('Replay Link');
      typeInto(videoInput, 'https://video/4');
      typeInto(replayInput, 'https://replay/4');

      dialogButton(seriesDialog, 'Submit')!.click();
      await render();

      expect(submit).toHaveBeenCalledWith(expect.objectContaining({
        groupId: 'g1',
        team1Id: 'team-p2',
        team2Id: 'team-p1',
        videoLink: 'https://video/4',
        demoLink: 'https://replay/4'
      }));
      expect(seriesDialog.isOpen).toBe(false);
      expect(saved.startTime).toBeInstanceOf(Date);
      expect(rows().length).toBe(4);
      expect(rows()[3].textContent).toContain('Oct 4, 2026, 6:30 PM');
    });

    it('closes the series dialog without submitting a series missing a team', async () => {
      const submit = vi.spyOn(apiService, 'submitDota2Match');
      const seriesDialog = dialog('Series');
      newSeriesButton().click();
      await render();

      dialogButton(seriesDialog, 'Submit')!.click();
      await render();

      expect(submit).not.toHaveBeenCalled();
      expect(seriesDialog.isOpen).toBe(false);
      expect(rows().length).toBe(3);
    });

    it('clears the video and replay links of the series in edit', async () => {
      const seriesDialog = dialog('Series');
      rowAction(rows()[0], 'Edit series')!.click();
      await render();
      await render();

      const content = dialogContent(seriesDialog);
      // the date and time pickers carry suffixes of their own, so only look at the link inputs
      const suffixes = () => Array.from(content.querySelectorAll('igx-input-group'))
        .filter(group => group.querySelector('input[type="url"]'))
        .map(group => group.querySelector<HTMLButtonElement>('igx-suffix button'))
        .filter(button => !!button);
      expect(suffixes().map(b => b.getAttribute('aria-label'))).toEqual(['Clear video link', 'Clear replay link']);

      suffixes()[0].click();
      await render();
      expect(played.videoLink).toBeNull();
      expect(played.demoLink).toBe('https://demo/1');

      suffixes()[0].click();
      await render();
      expect(played.demoLink).toBeNull();
      expect(suffixes().length).toBe(0);
    });
  });
});
