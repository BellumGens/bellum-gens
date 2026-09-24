import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMainComponent } from './admin-main.component';

import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { provideRouter } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { ApiTournamentsService, ApiShopService, Tournament, Game, TournamentApplication, TournamentApplicationState, ShopOrder, OrderStatus } from '../../../../../common/src/public_api';
import { IGridEditEventArgs } from '@infragistics/igniteui-angular/grids/core';
import { createSpyObj } from '../../../../../testing/spy-obj';

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
        ServiceWorkerModule.register('', { enabled: false }),
        AdminMainComponent
      ],
      providers: [
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideRouter([])
      ]
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
    httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/tournaments`).flush([]);
    httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/allregistrations`).flush([]);
    httpMock.expectOne(`${shopService['_apiEndpoint']}/shopadmin/orders`).flush([]);
    // The embedded catalog and promo editors load their data on creation.
    httpMock.expectOne(`${shopService['_apiEndpoint']}/shopadmin/products`).flush([]);
    httpMock.expectOne(`${shopService['_apiEndpoint']}/shopadmin/promos`).flush([]);
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

  describe('Order Management', () => {
    const paidOrder: ShopOrder = {
      id: 'order-1',
      orderSequence: 1,
      orderNumber: 'BG-2026-000001',
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '+359 888 123 456',
      city: 'Sofia',
      streetAddress: 'bul. Vitosha 1',
      country: 'BG',
      language: 'bg',
      deliveryMethod: 0,
      subtotal: 30,
      discountTotal: 0,
      shippingCost: 6,
      total: 36,
      currency: 'EUR',
      status: OrderStatus.Paid,
      paymentMethod: 0,
      orderDate: '2026-09-04T10:00:00Z',
      expiresOn: '2026-09-04T11:00:00Z',
      items: [],
      payments: []
    };

    it('should mark an order as shipped with the tracking number', () => {
      component.orders.set([paidOrder]);
      component.tracking['order-1'] = 'SPD-123';

      component.updateOrderStatus(paidOrder, OrderStatus.Shipped);

      const req = httpMock.expectOne(`${shopService['_apiEndpoint']}/shopadmin/orders/order-1/status`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual({ status: OrderStatus.Shipped, trackingNumber: 'SPD-123' });
      expect(req.request.withCredentials).toBe(true);

      req.flush({ ...paidOrder, status: OrderStatus.Shipped, trackingNumber: 'SPD-123' });

      expect(component.orders()[0].status).toBe(OrderStatus.Shipped);
      expect(component.orders()[0].trackingNumber).toBe('SPD-123');
    });

    it('should request a refund and reflect the returned status', () => {
      component.orders.set([paidOrder]);

      component.refundOrder(paidOrder);

      const req = httpMock.expectOne(`${shopService['_apiEndpoint']}/shopadmin/orders/order-1/refund`);
      expect(req.request.method).toBe('POST');
      req.flush({ ...paidOrder, status: OrderStatus.Refunded });

      expect(component.orders()[0].status).toBe(OrderStatus.Refunded);
    });

    it('should reload orders on demand', () => {
      component.loadOrders();

      const req = httpMock.expectOne(`${shopService['_apiEndpoint']}/shopadmin/orders`);
      expect(req.request.method).toBe('GET');
      req.flush([paidOrder]);

      expect(component.orders().length).toBe(1);
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
      const mockRowContext = createSpyObj('RowType', ['grid']);
      mockRowContext.grid = createSpyObj('IgxGridComponent', ['transactions']);
      mockRowContext.grid.transactions.commit = vi.fn();
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
        const mockRowContext = createSpyObj('RowType', ['grid']);
        mockRowContext.grid = createSpyObj('IgxGridComponent', ['transactions']);
        mockRowContext.grid.transactions.commit = vi.fn();
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
      const mockRowContext = createSpyObj('RowType', ['grid']);
      mockRowContext.grid = createSpyObj('IgxGridComponent', ['transactions']);
      mockRowContext.grid.transactions.commit = vi.fn();
      mockRowContext.grid.data = [{ id: 'reg-1' }];
      mockRowContext.key = 'reg-1';

      component.deleteRegistration(mockRowContext as any);

      expect(mockRowContext.grid.transactions.commit).toHaveBeenCalled();

      const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/delete?id=reg-1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });

});
