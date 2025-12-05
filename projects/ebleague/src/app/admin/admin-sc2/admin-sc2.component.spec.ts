import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdminSc2Component } from './admin-sc2.component';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ApiTournamentsService, Tournament, TournamentGroup, TournamentSC2Match, TournamentParticipant, TournamentApplication, TournamentApplicationState } from 'projects/common/src/public_api';
import { ServiceWorkerModule } from '@angular/service-worker';
import { IgxGridComponent } from '@infragistics/igniteui-angular/grids/grid';
import { IgxDialogComponent } from '@infragistics/igniteui-angular/dialog';

describe('AdminSc2Component', () => {
  let component: AdminSc2Component;
  let fixture: ComponentFixture<AdminSc2Component>;
  let httpMock: HttpTestingController;
  let apiService: ApiTournamentsService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        AdminSc2Component,
        ServiceWorkerModule.register('', { enabled: false }),
      ],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    }).compileComponents();
    httpMock = TestBed.inject(HttpTestingController);
    apiService = TestBed.inject(ApiTournamentsService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSc2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load tournaments', () => {
    const tounaments = [{ id: '123', active: true }, { id: '234', active: false }] as Tournament[];
    const spy = spyOn(component, 'selectTournament').and.callThrough();
    let req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/tournaments`);
    expect(req.request.method).toBe('GET');
    req.flush(tounaments);
    expect(component.tournaments).toEqual(tounaments);
    expect(spy).toHaveBeenCalled();

    req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/sc2regs?tournamentId=123`);
    expect(req.request.method).toBe('GET');
    expect(component.loading).toBeTrue();
    req.flush([]);
    expect(component.loading).toBeFalse();

    req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/tournamentregistrations?tournamentId=123`);
    expect(req.request.method).toBe('GET');
    expect(component.loadingRegs).toBeTrue();
    req.flush([]);
    expect(component.loadingRegs).toBeFalse();

    req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/sc2matches?tournamentId=123`);
    expect(req.request.method).toBe('GET');
    expect(component.loadingMatches).toBeTrue();
    req.flush([]);
    expect(component.loadingMatches).toBeFalse();

    req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/sc2groups?tournamentId=123`);
    expect(req.request.method).toBe('GET');
    expect(component.loadingGroups).toBeTrue();
    req.flush([]);
    expect(component.loadingGroups).toBeFalse();
  });

  describe('submitGroup', () => {
    beforeEach(() => {
      component.selectedTournament = { id: 'tournament-123', active: true } as Tournament;
      component.groups = [];
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

      expect(component.groups.length).toBe(1);
      expect(component.groups[0]).toEqual(returnedGroup);
    });

    it('should submit an existing group and not duplicate it in the array', () => {
      const existingGroup: TournamentGroup = {
        id: 'group-123',
        name: 'Group A',
        tournamentId: 'tournament-123',
        inEdit: true,
        participants: []
      };

      component.groups = [existingGroup];

      component.submitGroup(existingGroup);

      const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/sc2group?id=group-123`);
      expect(req.request.method).toBe('PUT');
      req.flush(existingGroup);

      expect(component.groups.length).toBe(1);
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
      component.groups = [group1, group2];
      component.pipeTrigger = 0;

      component.deleteGroup('group-1');

      const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/group?id=group-1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});

      expect(component.groups.length).toBe(1);
      expect(component.groups[0]).toEqual(group2);
      expect(component.pipeTrigger).toBe(1);
    });

    it('should increment pipeTrigger after deletion', () => {
      const group: TournamentGroup = { id: 'group-1', name: 'Group 1', participants: [] };
      component.groups = [group];
      component.pipeTrigger = 5;

      component.deleteGroup('group-1');

      const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/group?id=group-1`);
      req.flush({});

      expect(component.pipeTrigger).toBe(6);
    });
  });

  describe('submitMatch', () => {
    let mockGrid: jasmine.SpyObj<IgxGridComponent>;

    beforeEach(() => {
      component.selectedTournament = { id: 'tournament-123', active: true } as Tournament;
      component.matches = [];
      mockGrid = jasmine.createSpyObj('IgxGridComponent', ['addRow']);
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

      expect(mockGrid.addRow).toHaveBeenCalledWith(jasmine.objectContaining({
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

      expect(mockGrid.addRow).toHaveBeenCalledWith(jasmine.objectContaining({
        startTime: jasmine.any(Date)
      }));
    });
  });

  describe('addNewMatch', () => {
    beforeEach(() => {
      component.selectedTournament = { id: 'tournament-123', active: true } as Tournament;
    });

    it('should initialize a new match with tournament details', () => {
      component.groups = [
        { id: 'group-1', name: 'Group A' } as TournamentGroup,
        { id: 'group-2', name: 'Group B' } as TournamentGroup
      ];

      component.addNewMatch();

      expect(component.matchInEdit.tournamentId).toBe('tournament-123');
      expect(component.matchInEdit.maps).toEqual([]);
      expect(component.matchInEdit.groupId).toBe('group-2');
      expect(component.matchInEdit.startTime).toEqual(jasmine.any(Date));
    });

    it('should set groupId to null when no groups exist', () => {
      component.groups = [];

      component.addNewMatch();

      expect(component.matchInEdit.groupId).toBeNull();
    });

    it('should set groupId to the last group in the array', () => {
      component.groups = [
        { id: 'group-1', name: 'Group A' } as TournamentGroup,
        { id: 'group-2', name: 'Group B' } as TournamentGroup,
        { id: 'group-3', name: 'Group C' } as TournamentGroup
      ];

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
    let mockDialog: jasmine.SpyObj<IgxDialogComponent>;

    beforeEach(() => {
      mockDialog = jasmine.createSpyObj('IgxDialogComponent', ['open']);
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

      component.pipeTrigger = 0;
      component.addToGroup(dropEvent, group);

      const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/participanttogroup?id=group-1`);
      expect(req.request.method).toBe('PUT');
      req.flush({});

      expect(group.participants).toEqual([participant]);
      expect(component.pipeTrigger).toBe(1);
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

      component.pipeTrigger = 5;
      component.addToGroup(dropEvent, group);

      const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/participanttogroup?id=group-1`);
      expect(req.request.method).toBe('PUT');
      req.flush({});

      expect(group.participants.length).toBe(2);
      expect(group.participants[1]).toEqual(newParticipant);
      expect(component.pipeTrigger).toBe(6);
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

      component.pipeTrigger = 0;
      component.removeFromGroup(participant1, group);

      const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/participanttogroup?id=participant-1&groupid=group-1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});

      expect(group.participants.length).toBe(1);
      expect(group.participants[0]).toEqual(participant2);
      expect(component.pipeTrigger).toBe(1);
    });
  });

  describe('UI Integration Tests - Checkin State', () => {
    beforeEach(() => {
      component.selectedTournament = { id: 'tournament-123', active: true } as Tournament;
    });

    it('should reset checkin state and update all registrations', () => {
      const mockRegistrations = [
        { id: 'reg-1', state: 1 } as TournamentApplication,
        { id: 'reg-2', state: 0 } as TournamentApplication,
        { id: 'reg-3', state: 2, banned: true } as any
      ];

      component.registrations = mockRegistrations;
      const gridSpy = jasmine.createSpyObj('IgxGridComponent', ['notifyChanges']);
      component.registrationsGrid = gridSpy;

      component.resetCheckinState();

      const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/resetstate?tournamentId=tournament-123`);
      expect(req.request.method).toBe('GET');
      req.flush({});

      expect(component.registrations[0].state).toBe(0);
      expect(component.registrations[1].state).toBe(0);
      expect(component.registrations[2].state).toBe(2); // Banned users should not change
      expect(gridSpy.notifyChanges).toHaveBeenCalledWith(true);
    });

    it('should not change banned registrations when resetting checkin state', () => {
      const mockRegistrations = [
        { id: 'reg-1', state: 1 } as TournamentApplication,
        { id: 'reg-2', state: TournamentApplicationState.Banned } as TournamentApplication
      ];

      component.registrations = mockRegistrations;
      const gridSpy = jasmine.createSpyObj('IgxGridComponent', ['notifyChanges']);
      component.registrationsGrid = gridSpy;

      component.resetCheckinState();

      const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/resetstate?tournamentId=tournament-123`);
      expect(req.request.method).toBe('GET');
      req.flush({});

      expect(component.registrations[0].state).toBe(0);
      expect(component.registrations[1].state).toBe(TournamentApplicationState.Banned); // Should remain unchanged
    });
  });

  describe('UI Integration Tests - Send Emails', () => {
    beforeEach(() => {
      component.selectedTournament = { id: 'tournament-123', active: true } as Tournament;
    });

    it('should send checkin emails to registered players', (done) => {
      component.sendCheckinEmails();

      const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/sendcheckinemails?tournamentId=tournament-123`);
      expect(req.request.method).toBe('GET');
      req.flush({});

      setTimeout(() => {
        done();
      }, 100);
    });
  });

  describe('UI Integration Tests - Match Operations', () => {
    let mockGrid: jasmine.SpyObj<IgxGridComponent>;
    let mockDialog: jasmine.SpyObj<IgxDialogComponent>;

    beforeEach(() => {
      component.selectedTournament = { id: 'tournament-123', active: true } as Tournament;
      component.groups = [{ id: 'group-1', name: 'Group A' } as TournamentGroup];
      mockGrid = jasmine.createSpyObj('IgxGridComponent', ['addRow']);
      mockDialog = jasmine.createSpyObj('IgxDialogComponent', ['open', 'close']);
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

      expect(component.matches).toEqual(matches);
    });
  });

  describe('UI Integration Tests - Group Operations', () => {
    let mockDialog: jasmine.SpyObj<IgxDialogComponent>;

    beforeEach(() => {
      component.selectedTournament = { id: 'tournament-123', active: true } as Tournament;
      component.groups = [];
      mockDialog = jasmine.createSpyObj('IgxDialogComponent', ['open', 'close']);
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

      expect(component.groups.length).toBe(1);
      expect(component.groups[0]).toEqual(returnedGroup);
    });

    it('should edit an existing group', () => {
      const existingGroup: TournamentGroup = {
        id: 'group-1',
        name: 'Group A',
        inEdit: true,
        participants: []
      };

      component.groups = [existingGroup];
      existingGroup.name = 'Group A Updated';

      component.submitGroup(existingGroup);

      const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/sc2group?id=group-1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body.name).toBe('Group A Updated');

      req.flush(existingGroup);

      expect(component.groups.length).toBe(1);
      expect(component.groups[0].name).toBe('Group A Updated');
    });

    it('should delete a group with full UI flow', () => {
      const group1: TournamentGroup = { id: 'group-1', name: 'Group A', participants: [] };
      const group2: TournamentGroup = { id: 'group-2', name: 'Group B', participants: [] };
      component.groups = [group1, group2];
      component.pipeTrigger = 0;

      component.deleteGroup('group-1');

      const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/group?id=group-1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});

      expect(component.groups.length).toBe(1);
      expect(component.groups[0].name).toBe('Group B');
      expect(component.pipeTrigger).toBe(1);
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

      expect(component.groups).toEqual(groups);
    });
  });

  describe('UI Integration Tests - Player Group Management', () => {
    beforeEach(() => {
      component.selectedTournament = { id: 'tournament-123', active: true } as Tournament;
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
      component.pipeTrigger = 0;

      component.addToGroup(dragEvent, group);

      const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/participanttogroup?id=group-1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(player);
      req.flush({});

      expect(group.participants).toEqual([player]);
      expect(component.pipeTrigger).toBe(1);
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

      component.pipeTrigger = 0;
      component.removeFromGroup(player1, group);

      const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/participanttogroup?id=player-1&groupid=group-1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});

      expect(group.participants.length).toBe(1);
      expect(group.participants[0]).toEqual(player2);
      expect(component.pipeTrigger).toBe(1);
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

      expect(component.participants).toEqual(participants);
    });
  });

});
