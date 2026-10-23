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
      expect(named(newGroupCard, 'New group')).toBeTruthy();
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

    it('selects a tournament from the tournament dropdown', async () => {
      registrations.set([participant('p1', 'Alpha')]);
      create();
      const select = fixture.debugElement.query(By.directive(IgxSelectComponent)).componentInstance as IgxSelectComponent;
      expect(select.items.map(i => i.value)).toEqual(TOURNAMENTS);

      select.selectItem(select.items[1]);
      fixture.detectChanges();
      await fixture.whenStable();

      expect(component.selectedTournament()).toBe(TOURNAMENTS[1]);
      expect(apiService.getCsgoRegistrations).toHaveBeenCalledWith('t2');
      expect(el().querySelector('h1[igxCardHeaderTitle]').textContent).toContain('Autumn Cup Participants');
      expect(el().querySelector('igx-grid-toolbar-title').textContent).toContain('Autumn Cup Counter-Strike matches');
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

    it('exposes the group actions as named buttons instead of clickable icons', () => {
      const card = groupCards()[0];
      const labels = (root: Element) => Array.from(root.querySelectorAll('button')).map(b => b.getAttribute('aria-label'));

      expect(el().querySelectorAll('igx-icon.navigatable').length).toBe(0);
      expect(labels(card.querySelector('.action-buttons'))).toEqual(['Edit group', 'Delete group']);
      expect(named(card.querySelector('igx-list-item'), 'Remove from group').type).toBe('button');
      expect(named(el().querySelector('.new-group-card'), 'New group').type).toBe('button');

      named(card, 'Edit group').click();
      fixture.detectChanges();

      expect(labels(card.querySelector('.action-buttons'))).toEqual(['Cancel', 'Save group']);
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

      named(groupCards()[0].querySelector('igx-list-item'), 'Remove from group').click();
      fixture.detectChanges();

      expect(apiService.removeParticipantFromGroup).toHaveBeenCalledWith('p2', 'g1');
      expect(bravo.tournamentCSGOGroupId).toBeNull();
      expect(groupA.participants).toEqual([]);
      expect(component.pipeTrigger()).toBe(trigger + 1);
      expect(unassigned()).toEqual(['Alpha', 'Bravo']);
      expect(groupMembers(groupCards()[0])).toEqual([]);
    });

    it('returns a removed participant to the unassigned list when the group lists its own copy', () => {
      // The server sends the group members separately from the registrations
      const member = { ...bravo };
      groupA.participants = [member];
      fixture.detectChanges();

      component.removeFromGroup(member, groupA);
      fixture.detectChanges();

      expect(member.tournamentCSGOGroupId).toBeNull();
      expect(bravo.tournamentCSGOGroupId).toBeNull();
      expect(unassigned()).toEqual(['Alpha', 'Bravo']);
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

      named(card, 'Edit group').click();
      fixture.detectChanges();
      expect(groupA.inEdit).toBe(true);
      const input = card.querySelector<HTMLInputElement>('input#groupNameg1');
      input.value = 'Group Alpha';
      input.dispatchEvent(new Event('input'));

      named(card, 'Save group').click();
      fixture.detectChanges();

      expect(submit).toHaveBeenCalledWith(groupA, 't1');
      expect(groupA.name).toBe('Group Alpha');
      expect(groupA.inEdit).toBe(false);
      expect(card.querySelector('h1').textContent.trim()).toBe('Group Alpha');
      expect(card.querySelector('input#groupNameg1')).toBeNull();
    });

    it('clears the name of a group in edit', async () => {
      const card = groupCards()[0];
      named(card, 'Edit group').click();
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      const input = card.querySelector<HTMLInputElement>('input#groupNameg1');
      expect(input.value).toBe('Group A');
      named(card, 'Clear group name').click();
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(groupA.name).toBeNull();
      expect(input.value).toBe('');
      expect(card.querySelector('igx-suffix')).toBeNull();
    });

    it('clears the name of the new group', async () => {
      const newGroupCard = el().querySelector('.new-group-card');
      named(newGroupCard, 'New group').click();
      fixture.detectChanges();
      const input = newGroupCard.querySelector<HTMLInputElement>('input#newGroupName');
      input.value = 'Group B';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(component.newGroup.name).toBe('Group B');
      named(newGroupCard, 'Clear group name').click();
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(component.newGroup.name).toBeNull();
      expect(newGroupCard.querySelector('igx-suffix')).toBeNull();
    });

    it('gives each group name editor an id of its own, labelled by its label', () => {
      groups.set([groupA, { id: 'g2', name: 'Group B', participants: [] }]);
      fixture.detectChanges();
      groupCards().forEach(card => named(card, 'Edit group').click());
      named(el().querySelector('.new-group-card'), 'New group').click();
      fixture.detectChanges();

      const inputs = Array.from(el().querySelectorAll<HTMLInputElement>('.card-wrapper igx-card-header input'));
      expect(inputs.map(i => i.id)).toEqual(['groupNameg1', 'groupNameg2', 'newGroupName']);
      inputs.forEach(input => {
        const label = input.closest('igx-input-group').querySelector('label');
        expect(label.htmlFor).toBe(input.id);
        expect(label.textContent).toContain('Group name');
      });
    });

    it('cancels editing a group without submitting', () => {
      const submit = vi.spyOn(apiService, 'submitCSGOGroup');
      const card = groupCards()[0];

      named(card, 'Edit group').click();
      fixture.detectChanges();
      named(card, 'Cancel').click();
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

      named(newGroupCard, 'New group').click();
      fixture.detectChanges();
      expect(component.newGroup.inEdit).toBe(true);
      component.newGroup.name = 'Group B';

      const submitButton = Array.from(newGroupCard.querySelectorAll('button')).find(b => b.textContent.trim() === 'Submit');
      submitButton.click();
      fixture.detectChanges();

      expect(submit).toHaveBeenCalledWith(expect.objectContaining({ name: 'Group B' }), 't1');
      expect(component.newGroup.inEdit).toBe(false);
      expect(component.newGroup.name).toBeFalsy();
      expect(groupCards().map(c => c.querySelector('h1').textContent.trim())).toEqual(['Group A', 'Group B']);
    });

    it('cancels creating a new group', () => {
      const newGroupCard = el().querySelector('.new-group-card');
      named(newGroupCard, 'New group').click();
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
      // The members of the deleted group are unassigned again
      expect(bravo.tournamentCSGOGroupId).toBeNull();
      expect(unassigned()).toEqual(['Alpha', 'Bravo']);
    });

    it('keeps the group and its members when the deletion fails', async () => {
      vi.spyOn(apiService, 'deleteGroup').mockReturnValue(throwError(() => new Error('nope')));
      const trigger = component.pipeTrigger();

      await expectUnhandledError(() => component.deleteGroup('g1'));
      fixture.detectChanges();

      expect(component.pipeTrigger()).toBe(trigger);
      expect(bravo.tournamentCSGOGroupId).toBe('g1');
      expect(unassigned()).toEqual(['Alpha']);
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

  describe('match grid', () => {
    let alpha: TournamentParticipant;
    let bravo: TournamentParticipant;
    let played: TournamentCSGOMatch;
    let walkover: TournamentCSGOMatch;
    let upcoming: TournamentCSGOMatch;

    const render = async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();
    };
    const matchGrid = () => fixture.debugElement.query(By.directive(IgxGridComponent)).componentInstance as IgxGridComponent;
    const rows = () => Array.from(el().querySelectorAll('igx-grid-row'));
    const dialog = (title: string) => fixture.debugElement.queryAll(By.directive(IgxDialogComponent))
      .map(d => d.componentInstance as IgxDialogComponent)
      .find(d => d.title === title);
    const confirmMatch = () =>
      fixture.debugElement.queryAll(By.directive(ConfirmComponent))[1].componentInstance as ConfirmComponent;
    const dialogButton = (target: IgxDialogComponent, label: string) =>
      Array.from((target.toggleRef.element as HTMLElement).querySelectorAll<HTMLButtonElement>('.igx-dialog__window-actions button'))
        .find(b => b.textContent.trim() === label);
    const rowAction = (row: Element, label: string) => named(row.querySelector('.match-actions'), label);
    const selectsIn = (target: IgxDialogComponent) => fixture.debugElement.queryAll(By.directive(IgxSelectComponent))
      .filter(d => (target.toggleRef.element as HTMLElement).contains(d.nativeElement))
      .map(d => d.componentInstance as IgxSelectComponent);
    const typeInto = (input: HTMLInputElement, value: string) => {
      input.value = value;
      input.dispatchEvent(new Event('input'));
    };

    beforeEach(async () => {
      alpha = participant('p1', 'Alpha');
      bravo = participant('p2', 'Bravo');
      played = {
        id: 'm1', team1Id: 'team-p1', team2Id: 'team-p2', team1: alpha.team, team2: bravo.team, winnerTeamId: 'team-p1',
        startTime: new Date(2026, 9, 1, 18, 30), videoLink: 'https://video/1', demoLink: 'https://demo/1',
        maps: [{ id: 'mm1', map: CSGOMap.Mirage, team1Score: 13, team2Score: 7 } as TournamentCSGOMatchMap]
      };
      walkover = {
        id: 'm2', team1Id: 'team-p2', team2Id: 'team-p1', team1: bravo.team, team2: alpha.team, winnerTeamId: 'team-p1',
        startTime: new Date(2026, 9, 2, 18, 30), noShow: true, maps: []
      };
      upcoming = {
        id: 'm3', team1Id: 'team-p1', team2Id: 'team-p2', team1: alpha.team, team2: bravo.team,
        startTime: new Date(2026, 9, 3, 18, 30), maps: []
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

      expect(actions.map(b => b.getAttribute('aria-label'))).toEqual(['Add results', 'Edit match', 'Delete match']);
      actions.forEach(b => expect(b.type).toBe('button'));
    });

    it('renders a row per match with the teams, the winner, media links and start time', () => {
      expect(el().querySelector('igx-grid-toolbar-title').textContent).toContain('Spring Cup Counter-Strike matches');
      expect(rows().length).toBe(3);

      const teamLinks = (row: Element) => Array.from(row.querySelectorAll<HTMLAnchorElement>('a.grid-team-name'));
      expect(teamLinks(rows()[0]).map(a => a.textContent.trim())).toEqual(['Alpha', 'Bravo']);
      expect(teamLinks(rows()[0]).map(a => a.classList.contains('highlight'))).toEqual([true, false]);
      expect(teamLinks(rows()[1]).map(a => a.classList.contains('highlight'))).toEqual([false, true]);
      expect(teamLinks(rows()[2]).map(a => a.classList.contains('highlight'))).toEqual([false, false]);
      expect(teamLinks(rows()[0])[1].getAttribute('href')).toBe(`${component.environment.bellumgens}/team/team-p2`);

      const mediaLinks = (row: Element) => Array.from(row.querySelectorAll<HTMLAnchorElement>('a.horizontal-center'))
        .map(a => a.getAttribute('href'));
      expect(mediaLinks(rows()[0])).toEqual(['https://video/1', 'https://demo/1']);
      expect(mediaLinks(rows()[1])).toEqual([]);
      expect(rows()[1].textContent).toContain('No video');
      expect(rows()[1].textContent).toContain('No demo');
      expect(rows()[0].textContent).toContain('Oct 1, 2026, 6:30 PM');
    });

    it('shows the map scores, walkovers and unplayed matches in the row details', async () => {
      matchGrid().expandAll();
      await render();

      const details = Array.from(el().querySelectorAll('.igx-grid__tr-container'))
        .map(d => d.textContent.replace(/\s+/g, ' ').trim());
      expect(details.length).toBe(3);
      expect(details[0]).toContain('13');
      expect(details[0]).toContain('7');
      expect(details[1]).toContain('Walkover');
      expect(details[1]).not.toContain('The match has not been played yet');
      expect(details[2]).toContain('The match has not been played yet');
      expect(el().querySelector('.score-container + igx-avatar').getAttribute('title')).toBe('Mirage');
    });

    it('opens the results dialog for a row and submits the results', async () => {
      const submit = vi.spyOn(apiService, 'submitCSGOMatch').mockReturnValue(of(played));
      const results = dialog('Results');

      rowAction(rows()[0], 'Add results').click();
      await render();

      expect(results.isOpen).toBe(true);
      expect(component.matchInEdit).toBe(played);
      const labels = Array.from((results.toggleRef.element as HTMLElement).querySelectorAll('label')).map(l => l.textContent.trim());
      expect(labels).toEqual(expect.arrayContaining(['Points Alpha', 'Points Bravo', 'Rounds Alpha', 'Rounds Bravo']));

      dialogButton(results, 'Submit').click();
      await render();

      expect(submit).toHaveBeenCalledWith(played);
      expect(results.isOpen).toBe(false);
      // an existing match is updated in place rather than added again
      expect(rows().length).toBe(3);
    });

    it('closes the results dialog on cancel without submitting', async () => {
      const submit = vi.spyOn(apiService, 'submitCSGOMatch');
      const results = dialog('Results');

      rowAction(rows()[2], 'Add results').click();
      await render();
      expect(results.isOpen).toBe(true);
      // no maps are recorded yet, so the walkover checkbox is offered
      expect((results.toggleRef.element as HTMLElement).querySelector('igx-checkbox')).not.toBeNull();

      dialogButton(results, 'Cancel').click();
      await render();

      expect(results.isOpen).toBe(false);
      expect(submit).not.toHaveBeenCalled();
    });

    it('opens a row for editing in the match dialog and cancels it', async () => {
      const submit = vi.spyOn(apiService, 'submitCSGOMatch');
      const newMatch = dialog('New match');

      rowAction(rows()[1], 'Edit match').click();
      await render();

      expect(newMatch.isOpen).toBe(true);
      expect(component.matchInEdit).toBe(walkover);

      dialogButton(newMatch, 'Cancel').click();
      await render();

      expect(newMatch.isOpen).toBe(false);
      expect(submit).not.toHaveBeenCalled();
    });

    it('deletes a match row after confirmation', async () => {
      const remove = vi.spyOn(apiService, 'deleteCSGOMatch').mockReturnValue(of(null));
      const confirm = confirmMatch().dialog();

      rowAction(rows()[1], 'Delete match').click();
      await render();
      expect(confirm.isOpen).toBe(true);

      dialogButton(confirm, 'OK').click();
      await render();

      expect(remove).toHaveBeenCalledWith(walkover);
      expect(confirm.isOpen).toBe(false);
      expect(rows().length).toBe(2);
    });

    it('creates a new match from the toolbar and adds it to the grid', async () => {
      const saved = {
        id: 'm4', team1Id: 'team-p2', team2Id: 'team-p1', team1: bravo.team, team2: alpha.team, maps: [],
        startTime: '2026-10-04T18:30:00' as unknown as Date
      };
      const submit = vi.spyOn(apiService, 'submitCSGOMatch').mockReturnValue(of(saved));
      const newMatch = dialog('New match');
      component.matchInEdit = played;

      const newMatchButton = Array.from(el().querySelectorAll<HTMLButtonElement>('igx-grid-toolbar button'))
        .find(b => b.textContent.includes('New match'));
      newMatchButton.click();
      await render();

      expect(newMatch.isOpen).toBe(true);
      expect(component.matchInEdit).not.toBe(played);
      expect(component.matchInEdit.id).toBeUndefined();
      component.matchInEdit.team1Id = 'team-p2';
      component.matchInEdit.team2Id = 'team-p1';

      dialogButton(newMatch, 'Submit').click();
      await render();

      expect(submit).toHaveBeenCalledWith(expect.objectContaining({ team1Id: 'team-p2', team2Id: 'team-p1' }));
      expect(newMatch.isOpen).toBe(false);
      expect(saved.startTime).toBeInstanceOf(Date);
      expect(rows().length).toBe(4);
      expect(rows()[3].textContent).toContain('Oct 4, 2026, 6:30 PM');
    });

    it('closes the new match dialog without submitting a match missing a team', async () => {
      const submit = vi.spyOn(apiService, 'submitCSGOMatch');
      const newMatch = dialog('New match');
      const newMatchButton = Array.from(el().querySelectorAll<HTMLButtonElement>('igx-grid-toolbar button'))
        .find(b => b.textContent.includes('New match'));
      newMatchButton.click();
      await render();

      dialogButton(newMatch, 'Submit').click();
      await render();

      expect(submit).not.toHaveBeenCalled();
      expect(newMatch.isOpen).toBe(false);
      expect(rows().length).toBe(3);
    });

    it('fills in a new match from the dialog form', async () => {
      const submit = vi.spyOn(apiService, 'submitCSGOMatch').mockReturnValue(of(null));
      const newMatch = dialog('New match');
      const newMatchButton = Array.from(el().querySelectorAll<HTMLButtonElement>('igx-grid-toolbar button'))
        .find(b => b.textContent.includes('New match'));
      newMatchButton.click();
      await render();

      const [groupSelect, team1Select, team2Select] = selectsIn(newMatch);
      expect(groupSelect.items.map(i => i.value)).toEqual(['g1']);
      expect(team1Select.items.map(i => i.value)).toEqual(['team-p1', 'team-p2']);
      expect(team2Select.items.map(i => i.value)).toEqual(['team-p1', 'team-p2']);
      groupSelect.selectItem(groupSelect.items[0]);
      team1Select.selectItem(team1Select.items[1]);
      team2Select.selectItem(team2Select.items[0]);

      fixture.debugElement.query(By.directive(IgxDatePickerComponent)).injector.get(IgxDatePickerComponent)
        .select(new Date(2026, 9, 4));
      expect(component.matchInEdit.startTime.getDate()).toBe(4);
      fixture.debugElement.query(By.directive(IgxTimePickerComponent)).injector.get(IgxTimePickerComponent)
        .select(new Date(2026, 9, 4, 18, 30));
      expect(component.matchInEdit.startTime.getHours()).toBe(18);
      expect(component.matchInEdit.startTime.getMinutes()).toBe(30);

      const [videoInput, demoInput] = Array.from((newMatch.toggleRef.element as HTMLElement)
        .querySelectorAll<HTMLInputElement>('input[type="url"]'));
      typeInto(videoInput, 'https://video/4');
      typeInto(demoInput, 'https://demo/4');

      dialogButton(newMatch, 'Submit').click();
      await render();

      expect(submit).toHaveBeenCalledWith(expect.objectContaining({
        groupId: 'g1',
        team1Id: 'team-p2',
        team2Id: 'team-p1',
        videoLink: 'https://video/4',
        demoLink: 'https://demo/4'
      }));
    });

    it('records the results of a match from the results form', async () => {
      const submit = vi.spyOn(apiService, 'submitCSGOMatch').mockReturnValue(of(played));
      const results = dialog('Results');
      rowAction(rows()[0], 'Add results').click();
      await render();

      const [team1Points, team2Points, team1Rounds, team2Rounds] = Array.from((results.toggleRef.element as HTMLElement)
        .querySelectorAll<HTMLInputElement>('input[type="number"]'));
      typeInto(team1Points, '2');
      typeInto(team2Points, '1');
      typeInto(team1Rounds, '16');
      typeInto(team2Rounds, '14');
      const [mapSelect] = selectsIn(results);
      expect(mapSelect.items.length).toBe(component.mapList.length);
      mapSelect.selectItem(mapSelect.items[0]);

      dialogButton(results, 'Submit').click();
      await render();

      expect(submit).toHaveBeenCalledWith(played);
      expect(played.team1Points).toBe(2);
      expect(played.team2Points).toBe(1);
      expect(played.maps[0]).toEqual(expect.objectContaining({
        map: component.mapList[0].mapId,
        team1Score: 16,
        team2Score: 14
      }));
    });

    it('marks a match without maps as a walkover', async () => {
      const results = dialog('Results');
      rowAction(rows()[2], 'Add results').click();
      await render();

      (results.toggleRef.element as HTMLElement).querySelector<HTMLInputElement>('igx-checkbox input').click();
      fixture.detectChanges();

      expect(upcoming.noShow).toBe(true);
    });

    it('clears the video and demo links of the match in edit', async () => {
      const newMatch = dialog('New match');
      rowAction(rows()[0], 'Edit match').click();
      await render();
      await render();

      const content = newMatch.toggleRef.element as HTMLElement;
      // the date and time pickers carry suffixes of their own, so only look at the link inputs
      const suffixes = () => Array.from(content.querySelectorAll('igx-input-group'))
        .filter(group => group.querySelector('input[type="url"]'))
        .map(group => group.querySelector<HTMLButtonElement>('igx-suffix button'))
        .filter(button => !!button);
      expect(suffixes().map(b => b.getAttribute('aria-label'))).toEqual(['Clear video link', 'Clear demo link']);
      suffixes().forEach(b => expect(b.type).toBe('button'));

      suffixes()[0].click();
      await render();
      expect(played.videoLink).toBeNull();
      expect(played.demoLink).toBe('https://demo/1');
      expect(suffixes().length).toBe(1);

      suffixes()[0].click();
      await render();
      expect(played.demoLink).toBeNull();
      expect(suffixes().length).toBe(0);
    });
  });
});
