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
import { config, of, throwError } from 'rxjs';

import { AdminCsgoComponent } from './admin-csgo.component';
import {
  ApiTournamentsService,
  CSGOMap,
  CSGOTeam,
  Tournament,
  TournamentApplicationState,
  TournamentCSGOMatch,
  TournamentCSGOMatchMap,
  TournamentGroup,
  TournamentParticipant
} from '../../../../../common/src/public_api';
import { ConfirmComponent } from '../../../../../common/src/lib/confirm/confirm.component';

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

describe('AdminCsgoComponent', () => {
  let component: AdminCsgoComponent;
  let fixture: ComponentFixture<AdminCsgoComponent>;
  let apiService: ApiTournamentsService;
  let registrations: WritableSignal<TournamentParticipant []>;
  let groups: WritableSignal<TournamentGroup []>;
  let matches: WritableSignal<TournamentCSGOMatch []>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, AdminCsgoComponent],
      providers: [provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
    }).compileComponents();

    apiService = TestBed.inject(ApiTournamentsService);
    // the service's own state; its lazy getter hands it out read-only without fetching
    apiService['_tournaments'].set(TOURNAMENTS);

    registrations = signal<TournamentParticipant []>(null);
    groups = signal<TournamentGroup []>(null);
    matches = signal<TournamentCSGOMatch []>(null);
    vi.spyOn(apiService, 'getCsgoRegistrations').mockReturnValue(registrations);
    vi.spyOn(apiService, 'getCsgoGroups').mockReturnValue(groups);
    vi.spyOn(apiService, 'getCsgoMatches').mockReturnValue(matches);
  });

  const create = () => {
    fixture = TestBed.createComponent(AdminCsgoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  const el = (): HTMLElement => fixture.nativeElement;
  const unassigned = () => Array.from(el().querySelectorAll('.registration-slot a')).map(a => a.textContent.trim());
  const groupCards = () => Array.from(el().querySelectorAll<HTMLElement>('.card-wrapper > igx-card:not(.new-group-card)'));
  const groupMembers = (card: HTMLElement) =>
    Array.from(card.querySelectorAll('igx-list-item a')).map(a => a.textContent.trim());
  const iconIn = (root: Element, text: string) =>
    Array.from(root.querySelectorAll<HTMLElement>('igx-icon')).find(i => i.textContent.trim() === text);

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
      expect(component.groups()).toBeNull();
      expect(component.matches()).toBeNull();
      expect(apiService.getCsgoRegistrations).not.toHaveBeenCalled();
      expect(apiService.getCsgoGroups).not.toHaveBeenCalled();
      expect(apiService.getCsgoMatches).not.toHaveBeenCalled();
      expect(el().querySelector('h1[igxCardHeaderTitle]').textContent).toContain('No Participants');
      expect(el().querySelectorAll('.registration-slot').length).toBe(0);
      expect(groupCards().length).toBe(0);
    });

    it('shows the new group card', () => {
      create();

      const newGroupCard = el().querySelector('.new-group-card');
      expect(newGroupCard.textContent).toContain('New group');
      expect(iconIn(newGroupCard, 'add_circle_outline')).toBeTruthy();
    });
  });

  describe('selecting a tournament', () => {
    it('reads the registrations, groups and matches of the selected tournament', () => {
      create();
      registrations.set([participant('p1', 'Alpha')]);
      groups.set([{ id: 'g1', name: 'Group A', participants: [] }]);
      matches.set([]);

      selectFirstTournament();

      expect(component.selectedTournament()).toBe(TOURNAMENTS[0]);
      expect(apiService.getCsgoRegistrations).toHaveBeenCalledWith('t1');
      expect(apiService.getCsgoGroups).toHaveBeenCalledWith('t1');
      expect(apiService.getCsgoMatches).toHaveBeenCalledWith('t1');
      expect(component.registrations()).toEqual([participant('p1', 'Alpha')]);
      expect(component.groups().map(g => g.name)).toEqual(['Group A']);
      expect(component.matches()).toEqual([]);
      expect(el().querySelector('h1[igxCardHeaderTitle]').textContent).toContain('Spring Cup Participants');
    });

    it('switches to the data of another tournament', () => {
      const t2Registrations = signal([participant('p9', 'Omega')]);
      vi.mocked(apiService.getCsgoRegistrations).mockImplementation(id => id === 't2' ? t2Registrations : registrations);
      registrations.set([participant('p1', 'Alpha')]);
      create();

      selectFirstTournament();
      expect(unassigned()).toEqual(['Alpha']);

      component.selectTournament(TOURNAMENTS[1]);
      fixture.detectChanges();

      expect(apiService.getCsgoRegistrations).toHaveBeenLastCalledWith('t2');
      expect(unassigned()).toEqual(['Omega']);
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
      apiService['_loadingCSGORegistrations'].set(true);
      create();

      expect(component.loading()).toBe(true);
      expect(el().querySelector('.registration-container igx-circular-bar')).not.toBeNull();

      apiService['_loadingCSGORegistrations'].set(false);
      fixture.detectChanges();

      expect(el().querySelector('.registration-container igx-circular-bar')).toBeNull();
    });

    it('exposes the matches loading state of the service', () => {
      create();
      expect(component.loadingMatches()).toBe(false);

      apiService['_loadingCSGOMatches'].set(true);

      expect(component.loadingMatches()).toBe(true);
    });
  });

  describe('unassigned participants', () => {
    it('lists only the registrations that are not in a group', () => {
      registrations.set([
        participant('p1', 'Alpha'),
        participant('p2', 'Bravo', { tournamentCSGOGroupId: 'g1' }),
        participant('p3', 'Charlie')
      ]);
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
      bravo = participant('p2', 'Bravo', { tournamentCSGOGroupId: 'g1' });
      groupA = { id: 'g1', name: 'Group A', participants: [bravo] };
      registrations.set([alpha, bravo]);
      groups.set([groupA]);
      vi.spyOn(apiService, 'addParticipantToGroup').mockReturnValue(of({}));
      vi.spyOn(apiService, 'removeParticipantFromGroup').mockReturnValue(of({}));
      create();
      selectFirstTournament();
    });

    it('renders each group with its participants', () => {
      const cards = groupCards();
      expect(cards.length).toBe(1);
      expect(cards[0].querySelector('h1').textContent.trim()).toBe('Group A');
      expect(groupMembers(cards[0])).toEqual(['Bravo']);
    });

    it('moves a dropped participant from the unassigned list into the group', () => {
      expect(unassigned()).toEqual(['Alpha']);
      const trigger = component.pipeTrigger();

      const drop = fixture.debugElement.query(By.css('igx-list.group-list')).injector.get(IgxDropDirective);
      drop.dropped.emit({ dragData: alpha } as IDropDroppedEventArgs);
      fixture.detectChanges();

      expect(apiService.addParticipantToGroup).toHaveBeenCalledWith(alpha, 'g1');
      // the notInGroup pipe filters on the camelCase key
      expect(alpha.tournamentCSGOGroupId).toBe('g1');
      expect(component.pipeTrigger()).toBe(trigger + 1);
      expect(unassigned()).toEqual([]);
      expect(groupMembers(groupCards()[0])).toEqual(['Bravo', 'Alpha']);
    });

    it('starts the participant list of a group that had none', () => {
      const empty: TournamentGroup = { id: 'g2', name: 'Group B' };

      component.addToGroup({ dragData: alpha } as IDropDroppedEventArgs, empty);

      expect(empty.participants).toEqual([alpha]);
      expect(alpha.tournamentCSGOGroupId).toBe('g2');
    });

    it('returns a removed participant to the unassigned list once the server confirms', () => {
      expect(unassigned()).toEqual(['Alpha']);
      const trigger = component.pipeTrigger();

      iconIn(groupCards()[0].querySelector('igx-list-item'), 'delete').click();
      fixture.detectChanges();

      expect(apiService.removeParticipantFromGroup).toHaveBeenCalledWith('p2', 'g1');
      expect(bravo.tournamentCSGOGroupId).toBeNull();
      expect(groupA.participants).toEqual([]);
      expect(component.pipeTrigger()).toBe(trigger + 1);
      expect(unassigned()).toEqual(['Alpha', 'Bravo']);
      expect(groupMembers(groupCards()[0])).toEqual([]);
    });

    it('keeps the participant in the group when the removal fails', async () => {
      vi.mocked(apiService.removeParticipantFromGroup).mockReturnValue(throwError(() => new Error('nope')));
      const trigger = component.pipeTrigger();

      await expectUnhandledError(() => component.removeFromGroup(bravo, groupA));
      fixture.detectChanges();

      expect(bravo.tournamentCSGOGroupId).toBe('g1');
      expect(groupA.participants).toEqual([bravo]);
      expect(component.pipeTrigger()).toBe(trigger);
      expect(unassigned()).toEqual(['Alpha']);
    });

    it('edits a group name inline and submits it for the selected tournament', () => {
      const submit = vi.spyOn(apiService, 'submitCSGOGroup').mockReturnValue(of(groupA));
      const card = groupCards()[0];

      iconIn(card, 'edit').click();
      fixture.detectChanges();
      expect(groupA.inEdit).toBe(true);
      expect(card.querySelector('input#groupName')).not.toBeNull();

      iconIn(card, 'done').click();
      fixture.detectChanges();

      expect(submit).toHaveBeenCalledWith(groupA, 't1');
      expect(groupA.inEdit).toBe(false);
      expect(card.querySelector('input#groupName')).toBeNull();
    });

    it('cancels editing a group without submitting', () => {
      const submit = vi.spyOn(apiService, 'submitCSGOGroup');
      const card = groupCards()[0];

      iconIn(card, 'edit').click();
      fixture.detectChanges();
      iconIn(card, 'cancel').click();
      fixture.detectChanges();

      expect(groupA.inEdit).toBe(false);
      expect(submit).not.toHaveBeenCalled();
    });

    it('creates a new group for the selected tournament and relies on the service cache to show it', () => {
      const created: TournamentGroup = { id: 'g2', name: 'Group B', participants: [] };
      const submit = vi.spyOn(apiService, 'submitCSGOGroup').mockImplementation(() => {
        groups.update(list => [...list, created]);
        return of(created);
      });
      const newGroupCard = el().querySelector('.new-group-card');

      iconIn(newGroupCard, 'add_circle_outline').click();
      fixture.detectChanges();
      expect(component.newGroup.inEdit).toBe(true);
      component.newGroup.name = 'Group B';

      const submitButton = Array.from(newGroupCard.querySelectorAll('button')).find(b => b.textContent.trim() === 'Submit');
      submitButton.click();
      fixture.detectChanges();

      expect(submit).toHaveBeenCalledWith(expect.objectContaining({ name: 'Group B' }), 't1');
      expect(component.newGroup.inEdit).toBe(false);
      expect(groupCards().map(c => c.querySelector('h1').textContent.trim())).toEqual(['Group A', 'Group B']);
    });

    it('cancels creating a new group', () => {
      const newGroupCard = el().querySelector('.new-group-card');
      iconIn(newGroupCard, 'add_circle_outline').click();
      fixture.detectChanges();

      const cancelButton = Array.from(newGroupCard.querySelectorAll('button')).find(b => b.textContent.trim() === 'Cancel');
      cancelButton.click();
      fixture.detectChanges();

      expect(component.newGroup.inEdit).toBe(false);
      expect(newGroupCard.textContent).toContain('New group');
    });

    it('deletes a confirmed group and relies on the service cache to drop it', () => {
      const remove = vi.spyOn(apiService, 'deleteGroup').mockImplementation(() => {
        groups.set([]);
        return of(groupA);
      });
      const trigger = component.pipeTrigger();
      const confirmGroup = fixture.debugElement.queryAll(By.directive(ConfirmComponent))[0].componentInstance as ConfirmComponent;

      confirmGroup.ok.emit('g1');
      fixture.detectChanges();

      expect(remove).toHaveBeenCalledWith('g1');
      expect(component.pipeTrigger()).toBe(trigger + 1);
      expect(groupCards().length).toBe(0);
    });
  });

  describe('matches', () => {
    const grid = () => ({ addRow: vi.fn() }) as unknown as IgxGridComponent & { addRow: ReturnType<typeof vi.fn> };

    beforeEach(() => create());

    it('does not submit a match without both teams', () => {
      const submit = vi.spyOn(apiService, 'submitCSGOMatch');
      const matchGrid = grid();

      component.matchInEdit = { team1Id: 'team-p1' };
      component.submitMatch(matchGrid);
      component.matchInEdit = { team2Id: 'team-p2' };
      component.submitMatch(matchGrid);

      expect(submit).not.toHaveBeenCalled();
      expect(matchGrid.addRow).not.toHaveBeenCalled();
    });

    it('adds a newly created match to the grid with a Date start time', () => {
      const saved = { id: 'm1', team1Id: 'team-p1', team2Id: 'team-p2', startTime: '2026-10-01T18:00:00Z' as unknown as Date };
      const submit = vi.spyOn(apiService, 'submitCSGOMatch').mockReturnValue(of(saved));
      const matchGrid = grid();
      component.matchInEdit = { team1Id: 'team-p1', team2Id: 'team-p2' };

      component.submitMatch(matchGrid);

      expect(submit).toHaveBeenCalledWith({ team1Id: 'team-p1', team2Id: 'team-p2' });
      expect(matchGrid.addRow).toHaveBeenCalledWith(saved);
      expect(saved.startTime).toBeInstanceOf(Date);
      expect(saved.startTime.toISOString()).toBe('2026-10-01T18:00:00.000Z');
    });

    it('does not add a row when an existing match is updated', () => {
      vi.spyOn(apiService, 'submitCSGOMatch').mockReturnValue(of({ id: 'm1' }));
      const matchGrid = grid();
      component.matchInEdit = { id: 'm1', team1Id: 'team-p1', team2Id: 'team-p2' };

      component.submitMatch(matchGrid);

      expect(matchGrid.addRow).not.toHaveBeenCalled();
    });

    it('does not add a row when the server returns nothing', () => {
      vi.spyOn(apiService, 'submitCSGOMatch').mockReturnValue(of(null));
      const matchGrid = grid();
      component.matchInEdit = { team1Id: 'team-p1', team2Id: 'team-p2' };

      component.submitMatch(matchGrid);

      expect(matchGrid.addRow).not.toHaveBeenCalled();
    });

    it('deletes a match removed from the grid', () => {
      const remove = vi.spyOn(apiService, 'deleteCSGOMatch').mockReturnValue(of(null));
      const match: TournamentCSGOMatch = { id: 'm1' };

      component.deleteMatch({ data: match } as IRowDataEventArgs);

      expect(remove).toHaveBeenCalledWith(match);
    });

    it('deletes the confirmed match row by its id', () => {
      const confirmMatch = fixture.debugElement.queryAll(By.directive(ConfirmComponent))[1].componentInstance as ConfirmComponent;
      const matchGrid = fixture.debugElement.query(By.directive(IgxGridComponent)).componentInstance as IgxGridComponent;
      const deleteRow = vi.spyOn(matchGrid, 'deleteRowById').mockReturnValue(undefined);

      confirmMatch.ok.emit({ id: 'm1' });

      expect(deleteRow).toHaveBeenCalledWith('m1');
    });

    it('starts a fresh match for the new match dialog', () => {
      component.matchInEdit = { id: 'm1', team1Id: 'team-p1' };

      component.addNewMatch();

      expect(component.matchInEdit.id).toBeUndefined();
      expect(component.matchInEdit.team1Id).toBeUndefined();
      expect(component.matchInEdit.startTime).toBeInstanceOf(Date);
    });

    it('opens a match for editing with a Date start time', () => {
      const dialog = { open: vi.fn() } as unknown as IgxDialogComponent;
      const match: TournamentCSGOMatch = { id: 'm1', startTime: '2026-10-01T18:00:00Z' as unknown as Date };

      component.editMatch(match, dialog);

      expect(component.matchInEdit).toBe(match);
      expect(match.startTime).toBeInstanceOf(Date);
      expect(dialog.open).toHaveBeenCalled();
    });

    it('keeps an existing Date start time when editing', () => {
      const dialog = { open: vi.fn() } as unknown as IgxDialogComponent;
      const start = new Date('2026-10-01T18:00:00Z');
      const match: TournamentCSGOMatch = { id: 'm1', startTime: start };

      component.editMatch(match, dialog);

      expect(match.startTime).toBe(start);
    });

    describe('results dialog', () => {
      let match: TournamentCSGOMatch;
      let resultsDialog: IgxDialogComponent;

      const dialogButtons = (text: string) =>
        Array.from(document.querySelectorAll<HTMLButtonElement>('button')).filter(b => b.textContent.includes(text));

      beforeEach(async () => {
        match = {
          id: 'm1',
          team1Id: 'team-p1',
          team2Id: 'team-p2',
          team1: team('team-p1', 'Alpha'),
          team2: team('team-p2', 'Bravo'),
          startTime: new Date('2026-10-01T18:00:00Z'),
          maps: [{ id: 'mm1', map: CSGOMap.Mirage, team1Score: 13, team2Score: 7 } as TournamentCSGOMatchMap]
        };
        resultsDialog = fixture.debugElement.queryAll(By.directive(IgxDialogComponent))
          .map(d => d.componentInstance as IgxDialogComponent)
          .find(d => d.title === 'Results');
        component.editMatch(match, resultsDialog);
        fixture.detectChanges();
        await fixture.whenStable();
      });

      afterEach(() => resultsDialog.close());

      it('lists the maps of the match being edited', () => {
        expect(dialogButtons('Delete').length).toBe(1);
        expect(dialogButtons('Add a match map').length).toBe(1);
        // the walkover checkbox is only offered when no maps are recorded
        expect(document.querySelector('igx-checkbox')).toBeNull();
      });

      it('adds a match map for the match', () => {
        dialogButtons('Add a match map')[0].click();
        fixture.detectChanges();

        expect(match.maps.length).toBe(2);
        expect(match.maps[1]).toEqual({ csgoMatchId: 'm1' });
      });

      it('removes a deleted map from the row and marks the view for check', () => {
        const remove = vi.spyOn(apiService, 'deleteCSGOMatchMap').mockReturnValue(of(null));
        const markForCheck = vi.spyOn(component['cdr'], 'markForCheck');
        const maps = match.maps;

        dialogButtons('Delete')[0].click();

        expect(remove).toHaveBeenCalledWith('mm1');
        expect(maps).toEqual([]);
        expect(match.maps).toBe(maps);
        expect(markForCheck).toHaveBeenCalled();
      });

      it('keeps the map when deleting it fails', async () => {
        vi.spyOn(apiService, 'deleteCSGOMatchMap').mockReturnValue(throwError(() => new Error('nope')));

        await expectUnhandledError(() => component.deleteMatchMap(match.maps[0], match.maps));

        expect(match.maps.length).toBe(1);
      });
    });
  });
});
