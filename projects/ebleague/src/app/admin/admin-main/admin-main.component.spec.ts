import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMainComponent } from './admin-main.component';

import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ApiTournamentsService, ApiShopService, Tournament, Game, TournamentApplication, TournamentApplicationState, Order } from '../../../../../common/src/public_api';
import { IGridEditEventArgs, RowType } from '@infragistics/igniteui-angular/grids/core';

describe('AdminMainComponent', () => {
  let component: AdminMainComponent;
  let fixture: ComponentFixture<AdminMainComponent>;
  let httpMock: HttpTestingController;
  let apiService: ApiTournamentsService;
  let shopService: ApiShopService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        RouterTestingModule,
        ServiceWorkerModule.register('', { enabled: false }),
        AdminMainComponent
      ],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminMainComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    apiService = TestBed.inject(ApiTournamentsService);
    shopService = TestBed.inject(ApiShopService);

    // Handle constructor HTTP requests
    fixture.detectChanges();

    // Answer constructor's HTTP requests
    httpMock.expectOne(`${apiService['_apiEndpoint']}/admin/roles`).flush([]);
    httpMock.expectOne(`${apiService['_apiEndpoint']}/admin/promos`).flush([]);
    httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/tournaments`).flush([]);
    httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/allregistrations`).flush([]);
    httpMock.expectOne(`${shopService['_apiEndpoint']}/shop/orders`).flush([]);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Tournament Management', () => {
    it('should create a new tournament', () => {
      const newTournament: Tournament = {
        name: 'Test Tournament',
        description: 'A test tournament',
        startDate: new Date('2025-12-15'),
        endDate: new Date('2025-12-20'),
        active: true
      };

      component.updateTournament(newTournament);

      const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/create`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(newTournament);

      const createdTournament: Tournament = { id: 'tournament-1', ...newTournament };
      req.flush(createdTournament);

      // When passing a tournament parameter, it doesn't push to the array
      // The method only pushes when using this.tournament (no parameter)
      expect(component.tournaments).toBeDefined();
    });

    it('should create a tournament using component property', () => {
      component.tournament = {
        name: 'New Tournament',
        description: 'Testing',
        startDate: new Date('2025-12-15'),
        endDate: new Date('2025-12-20'),
        active: true
      };
      component.tournaments = [];

      component.updateTournament();

      const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/create`);
      expect(req.request.method).toBe('PUT');

      const createdTournament: Tournament = { id: 'tournament-2', ...component.tournament };
      req.flush(createdTournament);

      expect(component.tournaments.length).toBe(1);
    });

    it('should update an existing tournament', () => {
      const existingTournament: Tournament = {
        id: 'tournament-1',
        name: 'Updated Tournament',
        description: 'Updated description',
        startDate: new Date('2025-12-15'),
        endDate: new Date('2025-12-20'),
        active: false
      };

      component.updateTournament(existingTournament);

      const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/create`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(existingTournament);

      req.flush(existingTournament);
    });

    it('should initialize tournaments with parsed dates from subscription', () => {
      const mockTournaments: Tournament[] = [
        {
          id: 'tournament-1',
          name: 'Tournament 1',
          startDate: new Date('2025-12-15'),
          endDate: new Date('2025-12-20')
        }
      ];

      // Trigger the tournaments subscription
      apiService.tournaments.next(mockTournaments);

      expect(component.tournaments).toBeDefined();
      expect(component.tournaments.length).toBe(1);
      expect(component.tournaments[0].startDate instanceof Date).toBe(true);
      expect(component.tournaments[0].endDate instanceof Date).toBe(true);
    });
  });

  describe('Order Management - editDone', () => {
    it('should confirm an order with field updates', () => {
      const mockOrder: Order = {
        id: 'order-1',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe'
      };

      const gridEditEventArgs: IGridEditEventArgs = {
        rowData: { ...mockOrder },
        column: { field: 'firstName' } as any,
        newValue: 'Jane',
        oldValue: 'John'
      } as IGridEditEventArgs;

      component.editDone(gridEditEventArgs);

      const req = httpMock.expectOne(`${shopService['_apiEndpoint']}/shop/edit?orderId=order-1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body.firstName).toBe('Jane');

      req.flush({});
    });

    it('should confirm order with multiple field updates', () => {
      const mockOrder: Order = {
        id: 'order-2',
        firstName: 'John',
        lastName: 'Doe'
      };

      const gridEditEventArgs: IGridEditEventArgs = {
        rowData: { ...mockOrder },
        column: { field: 'lastName' } as any,
        newValue: 'Smith',
        oldValue: 'Doe'
      } as IGridEditEventArgs;

      component.editDone(gridEditEventArgs);

      const req = httpMock.expectOne(`${shopService['_apiEndpoint']}/shop/edit?orderId=order-2`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body.lastName).toBe('Smith');

      req.flush({});
    });
  });

  describe('Registration Management - confirmRegistration', () => {
    it('should confirm a registration with pending state', () => {
      const mockRegistration: TournamentApplication = {
        id: 'reg-1',
        userId: 'user-1',
        tournamentId: 'tournament-1',
        game: Game.StarCraft2,
        email: 'test@example.com',
        state: TournamentApplicationState.Pending
      };

      const gridEditEventArgs: IGridEditEventArgs = {
        rowData: { ...mockRegistration },
        column: { field: 'state' } as any,
        newValue: true,
        oldValue: false
      } as IGridEditEventArgs;

      component.confirmRegistration(gridEditEventArgs);

      const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/confirm?id=reg-1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body.state).toBe(1); // TournamentApplicationState.Confirmed

      req.flush({});
    });

    it('should reject a registration with unchecked checkbox', () => {
      const mockRegistration: TournamentApplication = {
        id: 'reg-2',
        userId: 'user-2',
        tournamentId: 'tournament-1',
        game: Game.CSGO,
        email: 'test2@example.com',
        state: TournamentApplicationState.Confirmed
      };

      const gridEditEventArgs: IGridEditEventArgs = {
        rowData: { ...mockRegistration },
        column: { field: 'state' } as any,
        newValue: false,
        oldValue: true
      } as IGridEditEventArgs;

      component.confirmRegistration(gridEditEventArgs);

      const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/confirm?id=reg-2`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body.state).toBe(0); // TournamentApplicationState.Pending

      req.flush({});
    });

    it('should handle multiple registration confirmations', () => {
      const registrations: TournamentApplication[] = [
        {
          id: 'reg-1',
          userId: 'user-1',
          tournamentId: 'tournament-1',
          game: Game.StarCraft2,
          email: 'test1@example.com',
          state: TournamentApplicationState.Pending
        },
        {
          id: 'reg-2',
          userId: 'user-2',
          tournamentId: 'tournament-1',
          game: Game.CSGO,
          email: 'test2@example.com',
          state: TournamentApplicationState.Pending
        }
      ];

      registrations.forEach(reg => {
        const gridEditEventArgs: IGridEditEventArgs = {
          rowData: { ...reg },
          column: { field: 'state' } as any,
          newValue: true,
          oldValue: false
        } as IGridEditEventArgs;

        component.confirmRegistration(gridEditEventArgs);
      });

      // Check first request
      let req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/confirm?id=reg-1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body.state).toBe(1);
      req.flush({});

      // Check second request
      req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/confirm?id=reg-2`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body.state).toBe(1);
      req.flush({});
    });
  });

  describe('Registration Management - deleteRegistration', () => {
    it('should delete a registration', () => {
      const mockRowContext = jasmine.createSpyObj('RowType', ['grid']);
      mockRowContext.grid = jasmine.createSpyObj('IgxGridComponent', ['transactions']);
      mockRowContext.grid.transactions.commit = jasmine.createSpy('commit');
      mockRowContext.grid.data = [];
      mockRowContext.key = 'reg-1';

      component.deleteRegistration(mockRowContext as any);

      expect(mockRowContext.grid.transactions.commit).toHaveBeenCalledWith([], 'reg-1');

      const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/delete?id=reg-1`);
      expect(req.request.method).toBe('DELETE');

      req.flush({});
    });

    it('should delete multiple registrations', () => {
      const createMockRowContext = (key: string) => {
        const mockRowContext = jasmine.createSpyObj('RowType', ['grid']);
        mockRowContext.grid = jasmine.createSpyObj('IgxGridComponent', ['transactions']);
        mockRowContext.grid.transactions.commit = jasmine.createSpy('commit');
        mockRowContext.grid.data = [];
        mockRowContext.key = key;
        return mockRowContext;
      };

      const rowContext1 = createMockRowContext('reg-1');
      const rowContext2 = createMockRowContext('reg-2');

      component.deleteRegistration(rowContext1 as any);
      component.deleteRegistration(rowContext2 as any);

      let req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/delete?id=reg-1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});

      req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/delete?id=reg-2`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });

    it('should commit transaction before deleting registration', () => {
      const mockRowContext = jasmine.createSpyObj('RowType', ['grid']);
      mockRowContext.grid = jasmine.createSpyObj('IgxGridComponent', ['transactions']);
      mockRowContext.grid.transactions.commit = jasmine.createSpy('commit');
      mockRowContext.grid.data = [{ id: 'reg-1' }];
      mockRowContext.key = 'reg-1';

      component.deleteRegistration(mockRowContext as any);

      expect(mockRowContext.grid.transactions.commit).toHaveBeenCalled();

      const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/delete?id=reg-1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });

  describe('Order Management - deleteOrder', () => {
    it('should delete an order', () => {
      const mockRowContext = jasmine.createSpyObj('RowType', ['grid']);
      mockRowContext.grid = jasmine.createSpyObj('IgxGridComponent', ['transactions']);
      mockRowContext.grid.transactions.commit = jasmine.createSpy('commit');
      mockRowContext.grid.data = [];
      mockRowContext.key = 'order-1';

      component.deleteOrder(mockRowContext as any);

      expect(mockRowContext.grid.transactions.commit).toHaveBeenCalledWith([], 'order-1');

      const req = httpMock.expectOne(`${shopService['_apiEndpoint']}/shop/order?orderId=order-1`);
      expect(req.request.method).toBe('DELETE');

      req.flush({});
    });

    it('should delete multiple orders', () => {
      const createMockRowContext = (key: string) => {
        const mockRowContext = jasmine.createSpyObj('RowType', ['grid']);
        mockRowContext.grid = jasmine.createSpyObj('IgxGridComponent', ['transactions']);
        mockRowContext.grid.transactions.commit = jasmine.createSpy('commit');
        mockRowContext.grid.data = [];
        mockRowContext.key = key;
        return mockRowContext;
      };

      const rowContext1 = createMockRowContext('order-1');
      const rowContext2 = createMockRowContext('order-2');

      component.deleteOrder(rowContext1 as any);
      component.deleteOrder(rowContext2 as any);

      let req = httpMock.expectOne(`${shopService['_apiEndpoint']}/shop/order?orderId=order-1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});

      req = httpMock.expectOne(`${shopService['_apiEndpoint']}/shop/order?orderId=order-2`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });

});
