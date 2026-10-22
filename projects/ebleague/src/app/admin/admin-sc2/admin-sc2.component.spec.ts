import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSc2Component } from './admin-sc2.component';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import {
  ApiTournamentsService,
  ApplicationUser,
  CommunicationService,
  SC2_MAPS,
  Tournament,
  TournamentGroup,
  TournamentSC2Match,
  TournamentParticipant,
  TournamentApplication,
  TournamentApplicationState
} from 'projects/common/src/public_api';
import { ServiceWorkerModule } from '@angular/service-worker';
import { By } from '@angular/platform-browser';
import { IgxGridComponent } from '@infragistics/igniteui-angular/grids/grid';
import { IgxDialogComponent } from '@infragistics/igniteui-angular/dialog';
import { IgxSelectComponent, IgxSelectItemComponent } from '@infragistics/igniteui-angular/select';
import { IgxDatePickerComponent } from '@infragistics/igniteui-angular/date-picker';
import { IgxTimePickerComponent } from '@infragistics/igniteui-angular/time-picker';
import { IgxAvatarComponent } from '@infragistics/igniteui-angular/avatar';
import { IDropDroppedEventArgs, IgxDropDirective } from '@infragistics/igniteui-angular/directives';
import { ConfirmComponent } from '../../../../../common/src/lib/confirm/confirm.component';
import { createSpyObj, SpyObj } from '../../../../../testing/spy-obj';

describe('AdminSc2Component', () => {
  let component: AdminSc2Component;
  let fixture: ComponentFixture<AdminSc2Component>;
  let httpMock: HttpTestingController;
  let apiService: ApiTournamentsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        AdminSc2Component,
        ServiceWorkerModule.register('', { enabled: false }),
      ],
      providers: [provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
    }).compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
    apiService = TestBed.inject(ApiTournamentsService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSc2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    // Background cache loads (the tournament list and the per-tournament data the template reads) aren't the subject
    // of most tests; anything else left outstanding is a failure
    httpMock.match(req => req.method === 'GET' &&
      /\/tournament\/(tournaments|sc2regs|tournamentregistrations|sc2groups|sc2matches)\b/.test(req.url));
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load tournaments', async () => {
    const tounaments = [{ id: '123', active: true }, { id: '234', active: false }] as Tournament[];
    // vi.spyOn calls through by default, matching the original .and.callThrough()
    const spy = vi.spyOn(component, 'selectTournament');
    let req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/tournaments`);
    expect(req.request.method).toBe('GET');
    req.flush(tounaments);
    expect(component.tournaments()).toEqual(tounaments);
    // The active tournament is selected by an effect
    await fixture.whenStable();
    expect(spy).toHaveBeenCalledWith(tounaments[0]);
    expect(component.selectedTournament()).toEqual(tounaments[0]);

    req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/sc2regs?tournamentId=123`);
    expect(req.request.method).toBe('GET');
    expect(component.loading()).toBe(true);
    req.flush([]);
    expect(component.loading()).toBe(false);

    req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/tournamentregistrations?tournamentId=123`);
    expect(req.request.method).toBe('GET');
    expect(component.loadingRegs()).toBe(true);
    req.flush([]);
    expect(component.loadingRegs()).toBe(false);

    req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/sc2matches?tournamentId=123`);
    expect(req.request.method).toBe('GET');
    expect(component.loadingMatches()).toBe(true);
    req.flush([]);
    expect(component.loadingMatches()).toBe(false);

    req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/sc2groups?tournamentId=123`);
    expect(req.request.method).toBe('GET');
    expect(component.loadingGroups()).toBe(true);
    req.flush([]);
    expect(component.loadingGroups()).toBe(false);
  });

  describe('submitGroup', () => {
    beforeEach(() => {
      component.selectedTournament.set({ id: 'tournament-123', active: true } as Tournament);
      component.groups.set([]);
    });

    it('should submit a new group and add it to the groups array', () => {
      const newGroup: TournamentGroup = {
        id: undefined,
        name: 'Group A',
        tournamentId: null,
        inEdit: true,
        participants: []
      };

      const returnedGroup: TournamentGroup = {
        id: 'group-123',
        name: 'Group A',
        tournamentId: 'tournament-123',
        inEdit: false,
        participants: []
      };

      component.submitGroup(newGroup);

      const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/sc2group`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body.tournamentId).toBe('tournament-123');
      expect(req.request.body.inEdit).toBe(false);
      req.flush(returnedGroup);

      expect(component.groups().length).toBe(1);
      expect(component.groups()[0]).toEqual(returnedGroup);
    });

    it('should submit an existing group and not duplicate it in the array', () => {
      const existingGroup: TournamentGroup = {
        id: 'group-123',
        name: 'Group A',
        tournamentId: 'tournament-123',
        inEdit: true,
        participants: []
      };

      component.groups.set([existingGroup]);

      component.submitGroup(existingGroup);

      const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/sc2group?id=group-123`);
      expect(req.request.method).toBe('PUT');
      req.flush(existingGroup);

      expect(component.groups().length).toBe(1);
    });

    it('should set tournamentId and inEdit flag correctly', () => {
      const newGroup: TournamentGroup = {
        id: undefined,
        name: 'Group B',
        tournamentId: null,
        inEdit: true,
        participants: []
      };

      component.submitGroup(newGroup);

      expect(newGroup.inEdit).toBe(false);
      expect(newGroup.tournamentId).toBe('tournament-123');

      const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/sc2group`);
      req.flush({ ...newGroup, id: 'group-456' });
    });
  });

  describe('deleteGroup', () => {
    it('should delete a group and remove it from the groups array', () => {
      const group1: TournamentGroup = { id: 'group-1', name: 'Group 1', participants: [] };
      const group2: TournamentGroup = { id: 'group-2', name: 'Group 2', participants: [] };
      component.groups.set([group1, group2]);
      component.pipeTrigger.set(0);

      component.deleteGroup('group-1');

      const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/group?id=group-1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});

      expect(component.groups().length).toBe(1);
      expect(component.groups()[0]).toEqual(group2);
      expect(component.pipeTrigger()).toBe(1);
    });

    it('should increment pipeTrigger after deletion', () => {
      const group: TournamentGroup = { id: 'group-1', name: 'Group 1', participants: [] };
      component.groups.set([group]);
      component.pipeTrigger.set(5);

      component.deleteGroup('group-1');

      const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/group?id=group-1`);
      req.flush({});

      expect(component.pipeTrigger()).toBe(6);
    });
  });

  describe('submitMatch', () => {
    let mockGrid: SpyObj<IgxGridComponent>;

    beforeEach(() => {
      component.selectedTournament.set({ id: 'tournament-123', active: true } as Tournament);
      component.matches.set([]);
      mockGrid = createSpyObj('IgxGridComponent', ['addRow']);
    });

    it('should submit a new match with player1Id and player2Id', () => {
      const newMatch: TournamentSC2Match = {
        id: undefined,
        tournamentId: 'tournament-123',
        player1Id: 'player-1',
        player2Id: 'player-2',
        startTime: new Date('2025-12-10T10:00:00'),
        maps: []
      };

      component.matchInEdit = newMatch;
      component.submitMatch(mockGrid);

      const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/sc2match`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body.player1Id).toBe('player-1');
      expect(req.request.body.player2Id).toBe('player-2');

      const returnedMatch = { ...newMatch, id: 'match-123', startTime: '2025-12-10T10:00:00' };
      req.flush(returnedMatch);

      expect(mockGrid.addRow).toHaveBeenCalledWith(expect.objectContaining({
        id: 'match-123',
        player1Id: 'player-1',
        player2Id: 'player-2'
      }));
    });

    it('should not submit a match without player1Id', () => {
      component.matchInEdit = {
        tournamentId: 'tournament-123',
        player2Id: 'player-2',
        startTime: new Date(),
        maps: []
      };

      component.submitMatch(mockGrid);

      httpMock.expectNone(`${apiService['_apiEndpoint']}/tournament/sc2match`);
      expect(mockGrid.addRow).not.toHaveBeenCalled();
    });

    it('should not submit a match without player2Id', () => {
      component.matchInEdit = {
        tournamentId: 'tournament-123',
        player1Id: 'player-1',
        startTime: new Date(),
        maps: []
      };

      component.submitMatch(mockGrid);

      httpMock.expectNone(`${apiService['_apiEndpoint']}/tournament/sc2match`);
      expect(mockGrid.addRow).not.toHaveBeenCalled();
    });

    it('should not add row to grid when updating existing match', () => {
      const existingMatch: TournamentSC2Match = {
        id: 'match-123',
        tournamentId: 'tournament-123',
        player1Id: 'player-1',
        player2Id: 'player-2',
        startTime: new Date('2025-12-10T10:00:00'),
        maps: []
      };

      component.matchInEdit = existingMatch;
      component.submitMatch(mockGrid);

      const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/sc2match?id=match-123`);
      expect(req.request.method).toBe('PUT');
      req.flush(existingMatch);

      expect(mockGrid.addRow).not.toHaveBeenCalled();
    });

    it('should convert startTime to Date object when adding to grid', () => {
      const newMatch: TournamentSC2Match = {
        tournamentId: 'tournament-123',
        player1Id: 'player-1',
        player2Id: 'player-2',
        startTime: new Date('2025-12-10T10:00:00'),
        maps: []
      };

      component.matchInEdit = newMatch;
      component.submitMatch(mockGrid);

      const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/sc2match`);
      const returnedMatch = { ...newMatch, id: 'match-123', startTime: '2025-12-10T10:00:00' };
      req.flush(returnedMatch);

      expect(mockGrid.addRow).toHaveBeenCalledWith(expect.objectContaining({
        startTime: expect.any(Date)
      }));
    });
  });

  describe('addNewMatch', () => {
    beforeEach(() => {
      component.selectedTournament.set({ id: 'tournament-123', active: true } as Tournament);
    });

    it('should initialize a new match with tournament details', () => {
      component.groups.set([
        { id: 'group-1', name: 'Group A' } as TournamentGroup,
        { id: 'group-2', name: 'Group B' } as TournamentGroup
      ]);

      component.addNewMatch();

      expect(component.matchInEdit.tournamentId).toBe('tournament-123');
      expect(component.matchInEdit.maps).toEqual([]);
      expect(component.matchInEdit.groupId).toBe('group-2');
      expect(component.matchInEdit.startTime).toEqual(expect.any(Date));
    });

    it('should set groupId to null when no groups exist', () => {
      component.groups.set([]);

      component.addNewMatch();

      expect(component.matchInEdit.groupId).toBeNull();
    });

    it('should set groupId to the last group in the array', () => {
      component.groups.set([
        { id: 'group-1', name: 'Group A' } as TournamentGroup,
        { id: 'group-2', name: 'Group B' } as TournamentGroup,
        { id: 'group-3', name: 'Group C' } as TournamentGroup
      ]);

      component.addNewMatch();

      expect(component.matchInEdit.groupId).toBe('group-3');
    });

    it('should initialize empty maps array', () => {
      component.addNewMatch();

      expect(component.matchInEdit.maps).toBeDefined();
      expect(component.matchInEdit.maps.length).toBe(0);
    });
  });

  describe('editMatch', () => {
    let mockDialog: SpyObj<IgxDialogComponent>;

    beforeEach(() => {
      mockDialog = createSpyObj('IgxDialogComponent', ['open']);
    });

    it('should set matchInEdit and open dialog', () => {
      const match: TournamentSC2Match = {
        id: 'match-123',
        tournamentId: 'tournament-123',
        player1Id: 'player-1',
        player2Id: 'player-2',
        startTime: new Date('2025-12-10T10:00:00'),
        maps: []
      };

      component.editMatch(match, mockDialog);

      expect(component.matchInEdit).toBe(match);
      expect(mockDialog.open).toHaveBeenCalled();
    });

    it('should convert string startTime to Date object', () => {
      const match: TournamentSC2Match = {
        id: 'match-123',
        tournamentId: 'tournament-123',
        player1Id: 'player-1',
        player2Id: 'player-2',
        startTime: '2025-12-10T10:00:00' as any,
        maps: []
      };

      component.editMatch(match, mockDialog);

      expect(match.startTime instanceof Date).toBe(true);
      expect(mockDialog.open).toHaveBeenCalled();
    });

    it('should not convert startTime if already a Date object', () => {
      const dateObj = new Date('2025-12-10T10:00:00');
      const match: TournamentSC2Match = {
        id: 'match-123',
        tournamentId: 'tournament-123',
        player1Id: 'player-1',
        player2Id: 'player-2',
        startTime: dateObj,
        maps: []
      };

      component.editMatch(match, mockDialog);

      expect(match.startTime).toBe(dateObj);
      expect(mockDialog.open).toHaveBeenCalled();
    });
  });

  describe('deleteMatch', () => {
    it('should delete a match', () => {
      const match: TournamentSC2Match = {
        id: 'match-123',
        tournamentId: 'tournament-123',
        player1Id: 'player-1',
        player2Id: 'player-2',
        startTime: new Date(),
        maps: []
      };

      const event = { data: match } as any;

      component.deleteMatch(event);

      const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/sc2match?id=match-123`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });

  describe('addToGroup', () => {
    it('should add a participant to a group with no existing participants', () => {
      const participant: TournamentParticipant = {
        id: 'participant-1',
        userName: 'Player1',
        userId: 'user-1',
        state: 0,
        companyId: 'company-1'
      } as TournamentParticipant;

      const group: TournamentGroup = {
        id: 'group-1',
        name: 'Group A',
        participants: null
      };

      const dropEvent = {
        dragData: participant
      } as any;

      component.pipeTrigger.set(0);
      component.addToGroup(dropEvent, group);

      const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/participanttogroup?id=group-1`);
      expect(req.request.method).toBe('PUT');
      req.flush({});

      expect(group.participants).toEqual([participant]);
      expect(component.pipeTrigger()).toBe(1);
    });

    it('should add a participant to a group with existing participants', () => {
      const existingParticipant: TournamentParticipant = {
        id: 'participant-1',
        userName: 'Player1',
        userId: 'user-1',
        state: 0,
        companyId: 'company-1'
      } as TournamentParticipant;

      const newParticipant: TournamentParticipant = {
        id: 'participant-2',
        userName: 'Player2',
        userId: 'user-2',
        state: 0,
        companyId: 'company-2'
      } as TournamentParticipant;

      const group: TournamentGroup = {
        id: 'group-1',
        name: 'Group A',
        participants: [existingParticipant]
      };

      const dropEvent = {
        dragData: newParticipant
      } as any;

      component.pipeTrigger.set(5);
      component.addToGroup(dropEvent, group);

      const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/participanttogroup?id=group-1`);
      expect(req.request.method).toBe('PUT');
      req.flush({});

      expect(group.participants.length).toBe(2);
      expect(group.participants[1]).toEqual(newParticipant);
      expect(component.pipeTrigger()).toBe(6);
    });
  });

  describe('removeFromGroup', () => {
    it('should remove a participant from a group', () => {
      const participant1: TournamentParticipant = {
        id: 'participant-1',
        userName: 'Player1',
        userId: 'user-1',
        state: 0,
        companyId: 'company-1'
      } as TournamentParticipant;

      const participant2: TournamentParticipant = {
        id: 'participant-2',
        userName: 'Player2',
        userId: 'user-2',
        state: 0,
        companyId: 'company-2'
      } as TournamentParticipant;

      const group: TournamentGroup = {
        id: 'group-1',
        name: 'Group A',
        participants: [participant1, participant2]
      };

      component.pipeTrigger.set(0);
      component.removeFromGroup(participant1, group);

      const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/participanttogroup?id=participant-1&groupid=group-1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});

      expect(group.participants.length).toBe(1);
      expect(group.participants[0]).toEqual(participant2);
      expect(component.pipeTrigger()).toBe(1);
    });
  });

  describe('UI Integration Tests - Checkin State', () => {
    beforeEach(() => {
      component.selectedTournament.set({ id: 'tournament-123', active: true } as Tournament);
    });

    it('should reset checkin state and update all registrations', () => {
      const mockRegistrations = [
        { id: 'reg-1', state: 1 } as TournamentApplication,
        { id: 'reg-2', state: 0 } as TournamentApplication,
        { id: 'reg-3', state: 2, banned: true } as any
      ];

      component.registrations.set(mockRegistrations);
      const gridSpy = createSpyObj('IgxGridComponent', ['notifyChanges']);
      vi.spyOn(component, 'registrationsGrid').mockReturnValue(gridSpy);

      component.resetCheckinState();

      const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/resetstate?tournamentId=tournament-123`);
      expect(req.request.method).toBe('GET');
      req.flush({});

      expect(component.registrations()[0].state).toBe(0);
      expect(component.registrations()[1].state).toBe(0);
      expect(component.registrations()[2].state).toBe(2); // Banned users should not change
      expect(gridSpy.notifyChanges).toHaveBeenCalledWith(true);
    });

    it('should not change banned registrations when resetting checkin state', () => {
      const mockRegistrations = [
        { id: 'reg-1', state: 1 } as TournamentApplication,
        { id: 'reg-2', state: TournamentApplicationState.Banned } as TournamentApplication
      ];

      component.registrations.set(mockRegistrations);
      const gridSpy = createSpyObj('IgxGridComponent', ['notifyChanges']);
      vi.spyOn(component, 'registrationsGrid').mockReturnValue(gridSpy);

      component.resetCheckinState();

      const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/resetstate?tournamentId=tournament-123`);
      expect(req.request.method).toBe('GET');
      req.flush({});

      expect(component.registrations()[0].state).toBe(0);
      expect(component.registrations()[1].state).toBe(TournamentApplicationState.Banned); // Should remain unchanged
    });
  });

  describe('UI Integration Tests - Send Emails', () => {
    beforeEach(() => {
      component.selectedTournament.set({ id: 'tournament-123', active: true } as Tournament);
    });

    it('should send checkin emails to registered players', async () => {
      component.sendCheckinEmails();

      const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/sendcheckinemails?tournamentId=tournament-123`);
      expect(req.request.method).toBe('GET');
      req.flush({});

      await new Promise(resolve => setTimeout(resolve, 100));
    });
  });

  describe('UI Integration Tests - Match Operations', () => {
    let mockGrid: SpyObj<IgxGridComponent>;
    let mockDialog: SpyObj<IgxDialogComponent>;

    beforeEach(() => {
      component.selectedTournament.set({ id: 'tournament-123', active: true } as Tournament);
      component.groups.set([{ id: 'group-1', name: 'Group A' } as TournamentGroup]);
      mockGrid = createSpyObj('IgxGridComponent', ['addRow']);
      mockDialog = createSpyObj('IgxDialogComponent', ['open', 'close']);
    });

    it('should create a new match with full UI flow', () => {
      // Initialize new match
      component.addNewMatch();
      expect(component.matchInEdit.tournamentId).toBe('tournament-123');
      expect(component.matchInEdit.groupId).toBe('group-1');

      // Set player data
      component.matchInEdit.player1Id = 'player-1';
      component.matchInEdit.player2Id = 'player-2';
      component.matchInEdit.startTime = new Date('2025-12-10T14:00:00');

      // Submit match
      component.submitMatch(mockGrid);

      const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/sc2match`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body.player1Id).toBe('player-1');

      const returnedMatch = {
        id: 'match-123',
        player1Id: 'player-1',
        player2Id: 'player-2',
        startTime: '2025-12-10T14:00:00',
        maps: []
      };
      req.flush(returnedMatch);

      expect(mockGrid.addRow).toHaveBeenCalled();
    });

    it('should edit an existing match with full UI flow', () => {
      const existingMatch: TournamentSC2Match = {
        id: 'match-123',
        player1Id: 'player-1',
        player2Id: 'player-2',
        startTime: new Date('2025-12-10T14:00:00'),
        maps: []
      };

      // Edit existing match
      component.editMatch(existingMatch, mockDialog);
      expect(mockDialog.open).toHaveBeenCalled();
      expect(component.matchInEdit).toBe(existingMatch);

      // Update match details
      component.matchInEdit.player1Id = 'player-3';
      component.submitMatch(mockGrid);

      const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/sc2match?id=match-123`);
      expect(req.request.method).toBe('PUT');
      req.flush(existingMatch);

      expect(mockGrid.addRow).not.toHaveBeenCalled();
    });

    it('should delete a match through UI', () => {
      const match: TournamentSC2Match = {
        id: 'match-123',
        player1Id: 'player-1',
        player2Id: 'player-2',
        startTime: new Date(),
        maps: []
      };

      const event = { data: match } as any;
      component.deleteMatch(event);

      const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/sc2match?id=match-123`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });

    it('should delete a match map from a match', () => {
      const map = { id: 'map-1', mapName: 'Entombed Valley' };
      const maps = [map, { id: 'map-2', mapName: 'New Repugnancy' }];

      component.deleteMatchMap(map as any, maps as any);

      const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/sc2matchmap?id=map-1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});

      expect(maps.length).toBe(1);
      expect(maps[0].id).toBe('map-2');
    });

    it('should refresh matches from API', () => {
      const matches = [
        {
          id: 'match-1',
          player1Id: 'player-1',
          player2Id: 'player-2',
          startTime: new Date()
        }
      ];

      component.refreshMatches();

      const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/sc2matches?tournamentId=tournament-123`);
      expect(req.request.method).toBe('GET');
      req.flush(matches);

      expect(component.matches()).toEqual(matches);
    });
  });

  describe('UI Integration Tests - Group Operations', () => {
    beforeEach(() => {
      component.selectedTournament.set({ id: 'tournament-123', active: true } as Tournament);
      component.groups.set([]);
    });

    it('should create a new group with full UI flow', () => {
      const newGroup: TournamentGroup = {
        name: 'Group A',
        participants: [],
        inEdit: true
      };

      component.submitGroup(newGroup);

      const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/sc2group`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body.tournamentId).toBe('tournament-123');

      const returnedGroup: TournamentGroup = {
        id: 'group-1',
        name: 'Group A',
        tournamentId: 'tournament-123',
        inEdit: false,
        participants: []
      };
      req.flush(returnedGroup);

      expect(component.groups().length).toBe(1);
      expect(component.groups()[0]).toEqual(returnedGroup);
    });

    it('should edit an existing group', () => {
      const existingGroup: TournamentGroup = {
        id: 'group-1',
        name: 'Group A',
        inEdit: true,
        participants: []
      };

      component.groups.set([existingGroup]);
      existingGroup.name = 'Group A Updated';

      component.submitGroup(existingGroup);

      const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/sc2group?id=group-1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body.name).toBe('Group A Updated');

      req.flush(existingGroup);

      expect(component.groups().length).toBe(1);
      expect(component.groups()[0].name).toBe('Group A Updated');
    });

    it('should delete a group with full UI flow', () => {
      const group1: TournamentGroup = { id: 'group-1', name: 'Group A', participants: [] };
      const group2: TournamentGroup = { id: 'group-2', name: 'Group B', participants: [] };
      component.groups.set([group1, group2]);
      component.pipeTrigger.set(0);

      component.deleteGroup('group-1');

      const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/group?id=group-1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});

      expect(component.groups().length).toBe(1);
      expect(component.groups()[0].name).toBe('Group B');
      expect(component.pipeTrigger()).toBe(1);
    });

    it('should refresh groups from API', () => {
      const groups = [
        { id: 'group-1', name: 'Group A', participants: [] },
        { id: 'group-2', name: 'Group B', participants: [] }
      ];

      component.refreshRegistrations();

      let req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/tournamentregistrations?tournamentId=tournament-123`);
      req.flush([]);

      req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/sc2groups?tournamentId=tournament-123`);
      expect(req.request.method).toBe('GET');
      req.flush(groups);

      expect(component.groups()).toEqual(groups);
    });
  });

  describe('UI Integration Tests - Player Group Management', () => {
    beforeEach(() => {
      component.selectedTournament.set({ id: 'tournament-123', active: true } as Tournament);
    });

    it('should add a player to a group with full UI flow', () => {
      const player: TournamentParticipant = {
        id: 'player-1',
        userName: 'Player One',
        userId: 'user-1',
        state: 0,
        companyId: 'company-1'
      } as TournamentParticipant;

      const group: TournamentGroup = {
        id: 'group-1',
        name: 'Group A',
        participants: null
      };

      const dragEvent = { dragData: player } as any;
      component.pipeTrigger.set(0);

      component.addToGroup(dragEvent, group);

      const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/participanttogroup?id=group-1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(player);
      req.flush({});

      expect(group.participants).toEqual([player]);
      expect(component.pipeTrigger()).toBe(1);
    });

    it('should add multiple players to a group sequentially', () => {
      const player1: TournamentParticipant = {
        id: 'player-1',
        userName: 'Player One',
        userId: 'user-1',
        state: 0,
        companyId: 'company-1'
      } as TournamentParticipant;

      const player2: TournamentParticipant = {
        id: 'player-2',
        userName: 'Player Two',
        userId: 'user-2',
        state: 0,
        companyId: 'company-2'
      } as TournamentParticipant;

      const group: TournamentGroup = {
        id: 'group-1',
        name: 'Group A',
        participants: [player1]
      };

      component.addToGroup({ dragData: player2 } as any, group);

      const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/participanttogroup?id=group-1`);
      expect(req.request.method).toBe('PUT');
      req.flush({});

      expect(group.participants.length).toBe(2);
      expect(group.participants[1]).toEqual(player2);
    });

    it('should remove a player from a group with full UI flow', () => {
      const player1: TournamentParticipant = {
        id: 'player-1',
        userName: 'Player One',
        userId: 'user-1',
        state: 0,
        companyId: 'company-1'
      } as TournamentParticipant;

      const player2: TournamentParticipant = {
        id: 'player-2',
        userName: 'Player Two',
        userId: 'user-2',
        state: 0,
        companyId: 'company-2'
      } as TournamentParticipant;

      const group: TournamentGroup = {
        id: 'group-1',
        name: 'Group A',
        participants: [player1, player2]
      };

      component.pipeTrigger.set(0);
      component.removeFromGroup(player1, group);

      const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/participanttogroup?id=player-1&groupid=group-1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});

      expect(group.participants.length).toBe(1);
      expect(group.participants[0]).toEqual(player2);
      expect(component.pipeTrigger()).toBe(1);
    });

    it('should submit participant points', () => {
      component.submitParticipantPoints('participant-1', 'group-1', 100);

      const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/participantpoints?participantId=participant-1&groupId=group-1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body.points).toBe(100);
      req.flush({});
    });

    it('should refresh participants from API', () => {
      const participants = [
        { id: 'player-1', userName: 'Player One', userId: 'user-1', state: 0, companyId: 'company-1' } as TournamentParticipant,
        { id: 'player-2', userName: 'Player Two', userId: 'user-2', state: 0, companyId: 'company-2' } as TournamentParticipant
      ];

      component.refreshParticipants();

      const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/sc2regs?tournamentId=tournament-123`);
      expect(req.request.method).toBe('GET');
      req.flush(participants);

      expect(component.participants()).toEqual(participants);
    });
  });

  describe('rendered admin view', () => {
    const TOURNAMENTS: Tournament [] = [
      { id: 't1', name: 'Spring League', active: true },
      { id: 't2', name: 'Autumn League' }
    ];

    const sc2User = (id: string, username: string, overrides: Partial<ApplicationUser> & { customURL?: string } = {}) =>
      ({ id, username, ...overrides }) as ApplicationUser;

    const sc2Player = (id: string, battleTag: string, overrides: Partial<TournamentParticipant> = {}): TournamentParticipant => ({
      id,
      userId: `user-${id}`,
      battleTag,
      state: TournamentApplicationState.Confirmed,
      companyId: 'Infragistics',
      user: sc2User(`user-${id}`, battleTag),
      ...overrides
    });

    let participants: TournamentParticipant [];
    let registrations: TournamentApplication [];
    let serverGroups: TournamentGroup [];
    let matches: TournamentSC2Match [];

    const api = () => apiService['_apiEndpoint'];
    const el = (): HTMLElement => fixture.nativeElement;
    const iconIn = (root: Element, text: string) =>
      Array.from(root.querySelectorAll<HTMLElement>('igx-icon')).find(i => i.textContent.trim() === text);
    const buttonIn = (root: Element, text: string) =>
      Array.from(root.querySelectorAll<HTMLButtonElement>('button')).find(b => b.textContent.includes(text));
    const grids = () => fixture.debugElement.queryAll(By.directive(IgxGridComponent)).map(d => d.componentInstance as IgxGridComponent);
    const registrationsGrid = () => grids()[0];
    const matchGrid = () => grids()[1];
    const dialogs = () => fixture.debugElement.queryAll(By.directive(IgxDialogComponent)).map(d => d.componentInstance as IgxDialogComponent);
    const dialogTitled = (title: string) => dialogs().find(d => d.title === title);
    const confirms = () => fixture.debugElement.queryAll(By.directive(ConfirmComponent)).map(d => d.componentInstance as ConfirmComponent);
    // The dialog window is moved into the overlay while open, so it is looked up through the dialog's toggle
    const dialogWindow = (dialog: IgxDialogComponent): HTMLElement => dialog.toggleRef.element;
    const dialogAction = (dialog: IgxDialogComponent, label: string) =>
      Array.from(dialogWindow(dialog).querySelectorAll<HTMLButtonElement>('.igx-dialog__window-actions button'))
        .find(b => b.textContent.trim() === label);
    const selects = () => fixture.debugElement.queryAll(By.directive(IgxSelectComponent)).map(d => d.componentInstance as IgxSelectComponent);
    const selectElement = (select: IgxSelectComponent): HTMLElement => select.element;
    const selectLabelled = (label: string) => selects().find(s => selectElement(s).textContent.includes(label));
    const unassigned = () => Array.from(el().querySelectorAll('.registration-slot a')).map(a => a.textContent.trim());
    const groupCards = () => Array.from(el().querySelectorAll<HTMLElement>('.card-wrapper > igx-card:not(.new-group-card)'));
    const newGroupCard = () => el().querySelector<HTMLElement>('.new-group-card');
    const typeInto = (input: HTMLInputElement, value: string) => {
      input.value = value;
      input.dispatchEvent(new Event('input'));
    };

    const render = async () => {
      fixture.detectChanges();
      await fixture.whenStable();
      // ngModel writes its value asynchronously, so bindings reading the control need another pass
      fixture.detectChanges();
    };
    const dataRow = (grid: IgxGridComponent, key: string) => grid.dataRowList.find(r => r.key === key);

    const flushTournamentData = async (id: string) => {
      httpMock.expectOne(`${api()}/tournament/sc2regs?tournamentId=${id}`).flush(participants);
      httpMock.expectOne(`${api()}/tournament/tournamentregistrations?tournamentId=${id}`).flush(registrations);
      httpMock.expectOne(`${api()}/tournament/sc2groups?tournamentId=${id}`).flush(serverGroups);
      httpMock.expectOne(`${api()}/tournament/sc2matches?tournamentId=${id}`).flush(matches);
      await render();
    };

    const loadTournaments = async (tournaments = TOURNAMENTS) => {
      httpMock.expectOne(`${api()}/tournament/tournaments`).flush(tournaments);
      // the active tournament is selected by an effect
      await render();
    };

    beforeEach(() => {
      const alpha = sc2Player('p1', 'Alpha#111', { state: TournamentApplicationState.Pending });
      const bravo = sc2Player('p2', 'Bravo#222', {
        user: sc2User('user-p2', 'Bravo', { customURL: 'bravo' }),
        tournamentSC2GroupId: 'g1'
      });
      const charlie = sc2Player('p3', 'Charlie#333', {
        user: sc2User('user-p3', 'Charlie', { sc2Details: { avatarUrl: 'charlie.png' } as ApplicationUser['sc2Details'] })
      });
      participants = [alpha, bravo, charlie];
      registrations = [
        { id: 'r1', email: 'alpha@sc2.gg', battleNetId: 'Alpha#111', state: TournamentApplicationState.Pending },
        { id: 'r2', email: 'bravo@sc2.gg', battleNetId: 'Bravo#222', state: TournamentApplicationState.Confirmed },
        { id: 'r3', email: 'charlie@sc2.gg', battleNetId: 'Charlie#333', state: TournamentApplicationState.Banned }
      ] as TournamentApplication [];
      serverGroups = [
        {
          id: 'g1',
          name: 'Group A',
          participants: [
            sc2Player('p2', 'Bravo#222', {
              state: TournamentApplicationState.Pending,
              user: sc2User('user-p2', 'Bravo', { csgoDetails: { customUrl: 'bravo-url' } as ApplicationUser['csgoDetails'] }),
              playerPoints: 3
            }),
            sc2Player('p4', 'Delta#444', { user: sc2User('user-p4', 'Delta', { sc2Details: { avatarUrl: 'delta.png' } as ApplicationUser['sc2Details'] }) })
          ]
        },
        { id: 'g2', name: 'Group B', participants: [] }
      ];
      matches = [
        {
          id: 'm1',
          tournamentId: 't1',
          player1Id: 'user-p1',
          player2Id: 'user-p3',
          player1: sc2User('user-p1', 'Alpha'),
          player2: sc2User('user-p3', 'Charlie'),
          player1Points: 2,
          player2Points: 1,
          startTime: '2026-10-01T18:00:00Z' as unknown as Date,
          videoLink: 'https://youtu.be/m1',
          demoLink: 'https://replays.sc2.gg/m1',
          maps: [
            { id: 'mm1', map: SC2_MAPS[0].id, winnerId: 'user-p1' },
            { id: 'mm2', map: SC2_MAPS[1].id, winnerId: 'user-p3' }
          ]
        },
        {
          id: 'm2',
          tournamentId: 't1',
          player1Id: 'user-p1',
          player2Id: 'user-p2',
          player1: sc2User('user-p1', 'Alpha'),
          player2: sc2User('user-p2', 'Bravo'),
          player1Points: 0,
          player2Points: 1,
          startTime: '2026-10-02T18:00:00Z' as unknown as Date,
          noShow: true,
          maps: []
        },
        {
          id: 'm3',
          tournamentId: 't1',
          player1Id: 'user-p2',
          player2Id: 'user-p3',
          player1: sc2User('user-p2', 'Bravo'),
          player2: sc2User('user-p3', 'Charlie'),
          startTime: '2026-10-03T18:00:00Z' as unknown as Date,
          maps: []
        }
      ];
    });

    it('shows placeholders and loads nothing tournament specific until a tournament is selected', async () => {
      await loadTournaments([{ id: 't2', name: 'Autumn League' }]);

      expect(component.selectedTournament()).toBeNull();
      const titles = Array.from(el().querySelectorAll('igx-grid-toolbar-title')).map(t => t.textContent.trim());
      expect(titles).toEqual(['No Registrations', 'No StarCraft II matches']);
      expect(el().querySelector('h1[igxCardHeaderTitle]').textContent).toContain('No Participants');
      expect(el().querySelectorAll('.registration-slot').length).toBe(0);
      expect(groupCards().length).toBe(0);
      expect(newGroupCard().textContent).toContain('New group');
    });

    it('shows progress indicators while the participants and groups load', async () => {
      await loadTournaments();

      expect(component.loading()).toBe(true);
      expect(component.loadingGroups()).toBe(true);
      expect(el().querySelector('.registration-container igx-circular-bar')).not.toBeNull();
      expect(el().querySelector('.card-wrapper igx-circular-bar')).not.toBeNull();
      expect(newGroupCard()).toBeNull();

      await flushTournamentData('t1');

      expect(el().querySelector('.registration-container igx-circular-bar')).toBeNull();
      expect(el().querySelector('.card-wrapper igx-circular-bar')).toBeNull();
      expect(newGroupCard()).not.toBeNull();
    });

    describe('with the active tournament loaded', () => {
      beforeEach(async () => {
        await loadTournaments();
        await flushTournamentData('t1');
      });

      it('names the selected tournament in the toolbars and the participants card', () => {
        const titles = Array.from(el().querySelectorAll('igx-grid-toolbar-title')).map(t => t.textContent.trim());
        expect(titles).toEqual(['Spring League Registrations', 'Spring League StarCraft II matches']);
        expect(el().querySelector('h1[igxCardHeaderTitle]').textContent).toContain('Spring League Participants');
      });

      it('loads the data of a tournament picked from the tournament select', async () => {
        const tournamentSelect = selectLabelled('Select tournament');
        expect(tournamentSelect.items.map(i => i.element.nativeElement.textContent.trim())).toEqual(['Spring League', 'Autumn League']);
        participants = [sc2Player('p9', 'Omega#999')];
        registrations = [];
        serverGroups = [];
        matches = [];

        tournamentSelect.selectItem(tournamentSelect.items[1]);
        await flushTournamentData('t2');

        expect(component.selectedTournament()).toEqual(TOURNAMENTS[1]);
        expect(el().querySelector('h1[igxCardHeaderTitle]').textContent).toContain('Autumn League Participants');
        expect(unassigned()).toEqual(['Omega#999']);
        expect(groupCards().length).toBe(0);
      });

      describe('registrations grid', () => {
        const stateIcons = () => Array.from(registrationsGrid().nativeElement.querySelectorAll<HTMLElement>('igx-grid-cell igx-icon'))
          .map(icon => ({ text: icon.textContent.trim(), className: icon.className.match(/color-\w+/)?.[0] }));

        it('renders the confirmation state of each registration as an icon', () => {
          expect(stateIcons()).toEqual([
            { text: 'close', className: 'color-error' },
            { text: 'check', className: 'color-success' },
            { text: 'warning', className: 'color-warn' }
          ]);
        });

        it('confirms a registration whose state is edited and clears its pending transaction', () => {
          const grid = registrationsGrid();

          const cell = grid.getCellByKey('r1', 'state');
          cell.editMode = true;
          cell.editValue = true;
          grid.endEdit(true);

          const req = httpMock.expectOne(`${api()}/tournament/confirm?id=r1`);
          expect(req.request.method).toBe('PUT');
          expect(req.request.body).toEqual(expect.objectContaining({ id: 'r1', state: 1 }));
          expect(grid.transactions.getState('r1')).toBeDefined();
          req.flush({});

          expect(grid.transactions.getState('r1')).toBeUndefined();
        });

        it('unconfirms a registration whose state is cleared', () => {
          const grid = registrationsGrid();
          const cell = grid.getCellByKey('r2', 'state');
          cell.editMode = true;
          cell.editValue = false;
          grid.endEdit(true);

          const req = httpMock.expectOne(`${api()}/tournament/confirm?id=r2`);
          expect(req.request.body).toEqual(expect.objectContaining({ id: 'r2', state: 0 }));
          req.flush({});
        });

        it('refreshes the registrations and groups from the toolbar', () => {
          const toolbar = registrationsGrid().nativeElement.querySelector('igx-grid-toolbar');

          iconIn(toolbar, 'refresh').closest('button').click();

          httpMock.expectOne(`${api()}/tournament/tournamentregistrations?tournamentId=t1`).flush([]);
          httpMock.expectOne(`${api()}/tournament/sc2groups?tournamentId=t1`).flush([]);
          expect(component.registrations()).toEqual([]);
          expect(component.groups()).toEqual([]);
        });

        it('resets the check-in state of all but banned registrations once confirmed', async () => {
          const resetCheckin = confirms()[3];
          buttonIn(registrationsGrid().nativeElement, 'Reset Checkin State').click();
          await render();
          expect(resetCheckin.dialog().isOpen).toBe(true);

          dialogAction(resetCheckin.dialog(), 'OK').click();
          const req = httpMock.expectOne(`${api()}/tournament/resetstate?tournamentId=t1`);
          expect(req.request.method).toBe('GET');
          req.flush({ message: 'Check-in reset' });
          await render();

          expect(component.registrations().map(r => r.state)).toEqual([
            TournamentApplicationState.Pending,
            TournamentApplicationState.Pending,
            TournamentApplicationState.Banned
          ]);
          expect(stateIcons().map(i => i.text)).toEqual(['close', 'close', 'warning']);
        });

        it('sends the check-in emails once confirmed and notifies the admin', async () => {
          const messages: string [] = [];
          const subscription = TestBed.inject(CommunicationService).message.subscribe(m => messages.push(m));
          const confirmEmails = confirms()[2];
          buttonIn(registrationsGrid().nativeElement, 'Send Emails for Checkin').click();
          await render();
          expect(confirmEmails.dialog().isOpen).toBe(true);

          dialogAction(confirmEmails.dialog(), 'OK').click();

          expect(messages).toEqual(['Sending checkin emails...']);
          const req = httpMock.expectOne(`${api()}/tournament/sendcheckinemails?tournamentId=t1`);
          expect(req.request.method).toBe('GET');
          req.flush({ message: 'Sent' });
          subscription.unsubscribe();
        });

        describe('row actions', () => {
          // The grid shows its action strip in the hovered row
          const stripButton = (title: string) =>
            dataRow(registrationsGrid(), 'r2').element.nativeElement.querySelector<HTMLButtonElement>(`igx-action-strip button[title="${title}"]`);

          beforeEach(async () => {
            registrationsGrid().actionStrip.show(dataRow(registrationsGrid(), 'r2'));
            await render();
          });

          it('offers only deleting a pristine registration', () => {
            expect(stripButton('Delete')).not.toBeNull();
            expect(stripButton('Undo')).toBeNull();
            expect(stripButton('Save')).toBeNull();
          });

          it('marks a registration deleted, then commits and deletes it on save', async () => {
            stripButton('Delete').click();
            await render();
            expect(registrationsGrid().transactions.getState('r2')).toBeDefined();
            expect(stripButton('Delete')).toBeNull();

            stripButton('Save').click();

            const req = httpMock.expectOne(`${api()}/tournament/delete?id=r2`);
            expect(req.request.method).toBe('DELETE');
            req.flush({});
            expect(registrationsGrid().transactions.getState('r2')).toBeUndefined();
            expect(registrationsGrid().data.map(r => r.id)).toEqual(['r1', 'r3']);
          });

          it('undoes a pending deletion', async () => {
            stripButton('Delete').click();
            await render();

            stripButton('Undo').click();
            await render();

            expect(registrationsGrid().transactions.getState('r2')).toBeUndefined();
            expect(stripButton('Delete')).not.toBeNull();
          });
        });
      });

      describe('matches grid', () => {
        const cellOf = (id: string, field: string): HTMLElement =>
          dataRow(matchGrid(), id).cells.find(c => c.column.field === field).nativeElement;

        it('renders the players of each match and highlights the winner', () => {
          const m1 = cellOf('m1', 'teams');
          expect(Array.from(m1.querySelectorAll('.grid-team-name')).map(n => [n.textContent.trim(), n.classList.contains('highlight')]))
            .toEqual([['Alpha', true], ['Charlie', false]]);
          const m2 = cellOf('m2', 'teams');
          expect(Array.from(m2.querySelectorAll('.grid-team-name')).map(n => [n.textContent.trim(), n.classList.contains('highlight')]))
            .toEqual([['Alpha', false], ['Bravo', true]]);
        });

        it('links the video and replay of a match when present', () => {
          expect(cellOf('m1', 'videoLink').querySelector('a').getAttribute('href')).toBe('https://youtu.be/m1');
          expect(cellOf('m1', 'demoLink').querySelector('a').getAttribute('href')).toBe('https://replays.sc2.gg/m1');
          expect(cellOf('m2', 'videoLink').textContent.trim()).toBe('No video');
          expect(cellOf('m2', 'demoLink').textContent.trim()).toBe('No replay');
        });

        it('shows the map results, walkovers and unplayed matches in the row details', async () => {
          matchGrid().expandAll();
          await render();

          const text = matchGrid().nativeElement.textContent;
          expect(text).toContain(SC2_MAPS[0].map);
          expect(text).toContain(SC2_MAPS[1].map);
          expect(text).toContain('Walkover');
          expect(text).toContain('The match has not been played yet, or there\'s no results on record...');
        });

        it('refreshes the matches from the toolbar', () => {
          const toolbar = matchGrid().nativeElement.querySelector('igx-grid-toolbar');

          iconIn(toolbar, 'refresh').closest('button').click();

          httpMock.expectOne(`${api()}/tournament/sc2matches?tournamentId=t1`).flush([]);
          expect(component.matches()).toEqual([]);
        });

        it('deletes a match once its deletion is confirmed', async () => {
          const confirmMatch = confirms()[1];
          iconIn(cellOf('m2', 'actions'), 'delete_forever').click();
          await render();
          expect(confirmMatch.dialog().isOpen).toBe(true);

          dialogAction(confirmMatch.dialog(), 'OK').click();

          const req = httpMock.expectOne(`${api()}/tournament/sc2match?id=m2`);
          expect(req.request.method).toBe('DELETE');
          req.flush({});
          expect(matchGrid().data.map(m => m.id)).toEqual(['m1', 'm3']);
        });

        describe('new match dialog', () => {
          let dialog: IgxDialogComponent;

          beforeEach(async () => {
            dialog = dialogTitled('New match');
            buttonIn(matchGrid().nativeElement, 'New match').click();
            await render();
          });

          afterEach(() => dialog.close());

          it('starts a new match in the last group of the selected tournament', () => {
            expect(dialog.isOpen).toBe(true);
            expect(component.matchInEdit).toEqual(expect.objectContaining({ tournamentId: 't1', groupId: 'g2', maps: [] }));
            expect(selectLabelled('Player 1').items.map(i => (i as IgxSelectItemComponent).itemText)).toEqual(['Alpha#111', 'Bravo#222', 'Charlie#333']);
          });

          it('clears the group of the match', async () => {
            const clearGroup = () => iconIn(selectElement(selectLabelled('Group')), 'clear');
            expect(clearGroup()).toBeDefined();

            clearGroup().click();
            await render();

            expect(component.matchInEdit.groupId).toBeNull();
            expect(clearGroup()).toBeUndefined();
          });

          it('clears the video and demo links of the match', async () => {
            const [video, demo] = Array.from(dialogWindow(dialog).querySelectorAll<HTMLInputElement>('input[type="url"]'));
            const clearOf = (input: HTMLInputElement) => iconIn(input.closest('igx-input-group'), 'clear');
            expect(clearOf(video)).toBeUndefined();
            expect(clearOf(demo)).toBeUndefined();

            typeInto(video, 'https://youtu.be/new');
            typeInto(demo, 'https://replays.sc2.gg/new');
            await render();
            expect(component.matchInEdit.videoLink).toBe('https://youtu.be/new');
            expect(component.matchInEdit.demoLink).toBe('https://replays.sc2.gg/new');

            clearOf(video).click();
            clearOf(demo).click();
            await render();

            expect(component.matchInEdit.videoLink).toBeNull();
            expect(component.matchInEdit.demoLink).toBeNull();
            expect(clearOf(video)).toBeUndefined();
            expect(clearOf(demo)).toBeUndefined();
          });

          it('submits the picked players and adds the created match to the grid', async () => {
            const player1 = selectLabelled('Player 1');
            const player2 = selectLabelled('Player 2');
            player1.selectItem(player1.items[0]);
            player2.selectItem(player2.items[1]);
            await render();

            dialogAction(dialog, 'Submit').click();

            const req = httpMock.expectOne(`${api()}/tournament/sc2match`);
            expect(req.request.method).toBe('PUT');
            expect(req.request.body).toEqual(expect.objectContaining({
              tournamentId: 't1', groupId: 'g2', player1Id: 'user-p1', player2Id: 'user-p2'
            }));
            req.flush({
              id: 'm4',
              player1Id: 'user-p1',
              player2Id: 'user-p2',
              player1: sc2User('user-p1', 'Alpha'),
              player2: sc2User('user-p2', 'Bravo'),
              startTime: '2026-10-04T18:00:00Z',
              maps: []
            });
            await render();

            expect(dialog.isOpen).toBe(false);
            const added = matchGrid().data.find(m => m.id === 'm4');
            expect(added.startTime).toEqual(new Date('2026-10-04T18:00:00Z'));
          });

          it('schedules the match in the picked group at the picked date and time', async () => {
            const datePicker = fixture.debugElement.query(By.directive(IgxDatePickerComponent)).componentInstance as IgxDatePickerComponent;
            const timePicker = fixture.debugElement.query(By.directive(IgxTimePickerComponent)).componentInstance as IgxTimePickerComponent;
            const groupPicker = selectLabelled('Group');

            datePicker.select(new Date(2026, 10, 5));
            await render();
            expect(component.matchInEdit.startTime).toEqual(new Date(2026, 10, 5));

            timePicker.select(new Date(2026, 10, 5, 19, 30));
            groupPicker.selectItem(groupPicker.items[0]);
            await render();

            expect(component.matchInEdit.startTime).toEqual(new Date(2026, 10, 5, 19, 30));
            expect(component.matchInEdit.groupId).toBe('g1');
          });

          it('records the races picked for the players', async () => {
            const raceInput = (group: number, race: string) => Array.from(dialogWindow(dialog).querySelectorAll('igx-radio-group'))[group]
              .querySelectorAll('igx-radio').item(['Protoss', 'Terran', 'Zerg'].indexOf(race)).querySelector('input');

            raceInput(0, 'Terran').click();
            raceInput(1, 'Zerg').click();
            await render();

            expect(component.matchInEdit.player1Race).toBe(2);
            expect(component.matchInEdit.player2Race).toBe(3);
          });

          it('does not add a row when the server returns no match', async () => {
            component.matchInEdit.player1Id = 'user-p1';
            component.matchInEdit.player2Id = 'user-p2';

            dialogAction(dialog, 'Submit').click();

            httpMock.expectOne(`${api()}/tournament/sc2match`).flush(null);
            await render();
            expect(matchGrid().data.length).toBe(3);
          });

          it('closes without submitting on cancel', async () => {
            dialogAction(dialog, 'Cancel').click();
            await render();

            expect(dialog.isOpen).toBe(false);
          });
        });

        it('opens a match for editing with a Date start time', async () => {
          const dialog = dialogTitled('New match');

          iconIn(cellOf('m3', 'actions'), 'edit').click();
          await render();

          expect(dialog.isOpen).toBe(true);
          expect(component.matchInEdit.id).toBe('m3');
          expect(component.matchInEdit.startTime).toEqual(new Date('2026-10-03T18:00:00Z'));

          dialogAction(dialog, 'Submit').click();
          const req = httpMock.expectOne(`${api()}/tournament/sc2match?id=m3`);
          req.flush(matches[2]);
          expect(matchGrid().data.length).toBe(3);
        });

        describe('results dialog', () => {
          let dialog: IgxDialogComponent;

          const openResults = async (id: string) => {
            iconIn(cellOf(id, 'actions'), 'add').click();
            await render();
          };

          beforeEach(() => dialog = dialogTitled('Results'));

          afterEach(() => dialog.close());

          it('lists the points and maps of the match with its two players as winner options', async () => {
            await openResults('m1');

            expect(dialog.isOpen).toBe(true);
            const labels = Array.from(dialogWindow(dialog).querySelectorAll('label')).map(l => l.textContent.trim());
            expect(labels).toContain('Points Alpha');
            expect(labels).toContain('Points Charlie');
            const winnerSelects = selects().filter(s => selectElement(s).textContent.includes('Winner'));
            expect(winnerSelects.length).toBe(2);
            expect(winnerSelects[0].items.map(i => (i as IgxSelectItemComponent).itemText)).toEqual(['Alpha#111', 'Charlie#333']);
            expect(dialogWindow(dialog).querySelector('igx-checkbox')).toBeNull();
          });

          it('deletes a map of the match', async () => {
            await openResults('m1');
            const maps = matches[0].maps;

            buttonIn(dialogWindow(dialog), 'Delete').click();

            const req = httpMock.expectOne(`${api()}/tournament/sc2matchmap?id=mm1`);
            expect(req.request.method).toBe('DELETE');
            req.flush({});
            await render();

            expect(component.matchInEdit.maps).toBe(maps);
            expect(maps.map(m => m.id)).toEqual(['mm2']);
            expect(dialogWindow(dialog).querySelectorAll('.delete-map').length).toBe(1);
          });

          it('adds a map to a recorded match and offers a walkover only while there are no maps', async () => {
            await openResults('m3');
            expect(dialogWindow(dialog).querySelector('igx-checkbox')).not.toBeNull();

            buttonIn(dialogWindow(dialog), 'Add a match map').click();
            await render();

            expect(component.matchInEdit.maps).toEqual([{ sc2MatchId: 'm3' }]);
            expect(dialogWindow(dialog).querySelector('igx-checkbox')).toBeNull();
          });

          it('records the points, map and winner entered for the match', async () => {
            await openResults('m1');
            const [points1, points2] = Array.from(dialogWindow(dialog).querySelectorAll<HTMLInputElement>('input[type="number"]'));
            const mapSelect = selects().find(s => selectElement(s).textContent.includes('Map'));
            const winnerSelect = selects().find(s => selectElement(s).textContent.includes('Winner'));

            typeInto(points1, '3');
            typeInto(points2, '0');
            mapSelect.selectItem(mapSelect.items[2]);
            winnerSelect.selectItem(winnerSelect.items[1]);
            await render();

            expect(component.matchInEdit.player1Points).toBe(3);
            expect(component.matchInEdit.player2Points).toBe(0);
            expect(component.matchInEdit.maps[0]).toEqual(expect.objectContaining({ id: 'mm1', map: SC2_MAPS[2].id, winnerId: 'user-p3' }));
          });

          it('records a walkover for a match without maps', async () => {
            await openResults('m3');

            dialogWindow(dialog).querySelector<HTMLInputElement>('igx-checkbox input').click();
            await render();

            expect(component.matchInEdit.noShow).toBe(true);
          });

          it('submits the results without adding a row', async () => {
            await openResults('m2');

            dialogAction(dialog, 'Submit').click();

            const req = httpMock.expectOne(`${api()}/tournament/sc2match?id=m2`);
            expect(req.request.body).toEqual(expect.objectContaining({ id: 'm2', noShow: true }));
            req.flush(matches[1]);
            await render();
            expect(dialog.isOpen).toBe(false);
            expect(matchGrid().data.length).toBe(3);
          });

          it('closes without submitting on cancel', async () => {
            await openResults('m2');

            dialogAction(dialog, 'Cancel').click();
            await render();

            expect(dialog.isOpen).toBe(false);
          });
        });
      });

      describe('participants and groups', () => {
        // the name of a member, without the text of its check-in badge
        const members = (card: HTMLElement) => Array.from(card.querySelectorAll('igx-list-item a'))
          .map(a => Array.from(a.childNodes).filter(n => n.nodeType === Node.TEXT_NODE).map(n => n.textContent).join('').trim());

        it('lists the participants that are not in a group, flagging pending check-ins', () => {
          expect(unassigned()).toEqual(['Alpha#111', 'Charlie#333']);
          const slots = el().querySelectorAll('.registration-slot');
          expect(slots[0].querySelector('igx-badge')).not.toBeNull();
          expect(slots[1].querySelector('igx-badge')).toBeNull();
          expect(slots[0].querySelector('a').getAttribute('href')).toBe(`${component.environment.bellumgens}/players/user-p1`);
          const avatars = fixture.debugElement.queryAll(By.css('.registration-slot igx-avatar')).map(a => a.componentInstance as IgxAvatarComponent);
          expect(avatars.map(a => [a.initials, a.src])).toEqual([['Alpha#111', undefined], ['Charlie', 'charlie.png']]);
        });

        it('links a participant through its custom url when it has one', async () => {
          participants[0].user = sc2User('user-p1', 'Alpha', { customURL: 'alpha' });

          iconIn(el().querySelector('igx-card-header'), 'refresh').closest('button').click();

          httpMock.expectOne(`${api()}/tournament/sc2regs?tournamentId=t1`).flush([...participants]);
          await render();

          expect(el().querySelector('.registration-slot a').getAttribute('href')).toBe(`${component.environment.bellumgens}/players/alpha`);
        });

        it('renders the groups in server order with their members', () => {
          const cards = groupCards();
          expect(cards.map(c => c.querySelector('h1').textContent.trim())).toEqual(['Group A', 'Group B']);
          expect(members(cards[0])).toEqual(['Bravo', 'Delta']);
          const links = Array.from(cards[0].querySelectorAll('igx-list-item a')).map(a => a.getAttribute('href'));
          expect(links).toEqual([
            `${component.environment.bellumgens}/players/bravo-url`,
            `${component.environment.bellumgens}/players/user-p4`
          ]);
          const items = cards[0].querySelectorAll('igx-list-item');
          expect(items[0].querySelector('igx-badge')).not.toBeNull();
          expect(items[1].querySelector('igx-badge')).toBeNull();
          expect(members(cards[1])).toEqual([]);
        });

        it('adds a participant dropped on a group', async () => {
          const trigger = component.pipeTrigger();
          const charlie = participants[2];
          const drop = fixture.debugElement.queryAll(By.css('igx-list.group-list'))[1].injector.get(IgxDropDirective);

          drop.dropped.emit({ dragData: charlie } as IDropDroppedEventArgs);

          const req = httpMock.expectOne(`${api()}/tournament/participanttogroup?id=g2`);
          expect(req.request.method).toBe('PUT');
          expect(req.request.body).toBe(charlie);
          req.flush({});
          await render();

          expect(component.pipeTrigger()).toBe(trigger + 1);
          expect(members(groupCards()[1])).toEqual(['Charlie']);
        });

        it('removes a participant from a group', async () => {
          const trigger = component.pipeTrigger();

          iconIn(groupCards()[0].querySelector('igx-list-item'), 'delete').click();

          const req = httpMock.expectOne(`${api()}/tournament/participanttogroup?id=p2&groupid=g1`);
          expect(req.request.method).toBe('DELETE');
          req.flush({});
          await render();

          expect(component.pipeTrigger()).toBe(trigger + 1);
          expect(members(groupCards()[0])).toEqual(['Delta']);
        });

        it('submits the points entered for a group member', async () => {
          const points = groupCards()[0].querySelector<HTMLInputElement>('input[name="groupPosition"]');
          await render();
          expect(points.value).toBe('3');

          typeInto(points, '7');

          const req = httpMock.expectOne(`${api()}/tournament/participantpoints?participantId=p2&groupId=g1`);
          expect(req.request.method).toBe('PUT');
          expect(req.request.body).toEqual({ points: 7 });
          req.flush({});
          expect(component.groups()[0].participants[0].playerPoints).toBe(7);
        });

        it('renames a group inline and submits it for the selected tournament', async () => {
          const card = groupCards()[0];

          iconIn(card, 'edit').click();
          await render();
          const input = card.querySelector<HTMLInputElement>('input#groupName');
          expect(input).not.toBeNull();
          typeInto(input, 'Group Alpha');

          iconIn(card, 'done').click();

          const req = httpMock.expectOne(`${api()}/tournament/sc2group?id=g1`);
          expect(req.request.method).toBe('PUT');
          expect(req.request.body).toEqual(expect.objectContaining({ name: 'Group Alpha', tournamentId: 't1', inEdit: false }));
          req.flush({ ...req.request.body });
          await render();

          expect(card.querySelector('input#groupName')).toBeNull();
          expect(groupCards().map(c => c.querySelector('h1').textContent.trim())).toEqual(['Group Alpha', 'Group B']);
        });

        it('cancels renaming a group without submitting', async () => {
          const card = groupCards()[0];

          iconIn(card, 'edit').click();
          await render();
          iconIn(card, 'cancel').click();
          await render();

          expect(card.querySelector('input#groupName')).toBeNull();
          expect(card.querySelector('h1').textContent.trim()).toBe('Group A');
        });

        it('deletes a group once its deletion is confirmed', async () => {
          const confirmGroup = confirms()[0];
          const trigger = component.pipeTrigger();

          iconIn(groupCards()[1], 'delete_forever').click();
          await render();
          expect(confirmGroup.dialog().isOpen).toBe(true);
          dialogAction(confirmGroup.dialog(), 'OK').click();

          const req = httpMock.expectOne(`${api()}/tournament/group?id=g2`);
          expect(req.request.method).toBe('DELETE');
          req.flush({});
          await render();

          expect(component.pipeTrigger()).toBe(trigger + 1);
          expect(groupCards().map(c => c.querySelector('h1').textContent.trim())).toEqual(['Group A']);
        });

        it('creates a new group for the selected tournament', async () => {
          iconIn(newGroupCard(), 'add_circle_outline').click();
          await render();
          const input = newGroupCard().querySelector<HTMLInputElement>('input#groupName');
          typeInto(input, 'Group C');
          await render();

          buttonIn(newGroupCard(), 'Submit').click();

          const req = httpMock.expectOne(`${api()}/tournament/sc2group`);
          expect(req.request.method).toBe('PUT');
          expect(req.request.body).toEqual(expect.objectContaining({ name: 'Group C', tournamentId: 't1', inEdit: false }));
          req.flush({ id: 'g3', name: 'Group C', tournamentId: 't1', participants: [] });
          await render();

          expect(groupCards().map(c => c.querySelector('h1').textContent.trim())).toEqual(['Group A', 'Group B', 'Group C']);
          expect(newGroupCard().textContent).toContain('New group');
        });

        it('clears the name of a new group and cancels creating it', async () => {
          iconIn(newGroupCard(), 'add_circle_outline').click();
          await render();
          expect(newGroupCard().querySelector('igx-suffix')).toBeNull();
          typeInto(newGroupCard().querySelector<HTMLInputElement>('input#groupName'), 'Group C');
          await render();

          newGroupCard().querySelector<HTMLElement>('igx-suffix').click();
          await render();
          expect(component.newGroup.name).toBeNull();
          expect(newGroupCard().querySelector('igx-suffix')).toBeNull();

          buttonIn(newGroupCard(), 'Cancel').click();
          await render();

          expect(component.newGroup.inEdit).toBe(false);
          expect(newGroupCard().textContent).toContain('New group');
        });
      });
    });
  });

});
