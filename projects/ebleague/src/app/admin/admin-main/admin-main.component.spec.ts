import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMainComponent } from './admin-main.component';

import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import {
  ApiTournamentsService, ApiShopService, CommunicationService, Tournament, Game, TournamentApplication, TournamentApplicationState,
  EMPTY_NEW_TOURNAMENT, ShopOrder, OrderStatus, DeliveryMethod
} from '../../../../../common/src/public_api';
import { IGridEditEventArgs } from '@infragistics/igniteui-angular/grids/core';
import { IgxGridComponent } from '@infragistics/igniteui-angular/grids/grid';
import { IgxActionStripComponent } from '@infragistics/igniteui-angular/action-strip';
import { IgxDatePickerComponent } from '@infragistics/igniteui-angular/date-picker';
import { createSpyObj } from '../../../../../testing/spy-obj';

interface InitialData {
  roles?: string [];
  tournaments?: Tournament [];
  registrations?: TournamentApplication [];
  orders?: ShopOrder [];
}

const shopOrder = (order: Partial<ShopOrder> = {}): ShopOrder => ({
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
  deliveryMethod: DeliveryMethod.Courier,
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
  payments: [],
  ...order
});

describe('AdminMainComponent', () => {
  let component: AdminMainComponent;
  let fixture: ComponentFixture<AdminMainComponent>;
  let httpMock: HttpTestingController;
  let apiService: ApiTournamentsService;
  let shopService: ApiShopService;

  // Answers the requests the component (and its template) issue on creation
  const flushInitialRequests = (data: InitialData = {}) => {
    const initial = { roles: [], tournaments: [], registrations: [], orders: [], ...data };
    httpMock.expectOne(`${apiService['_apiEndpoint']}/admin/roles`).flush(initial.roles);
    httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/tournaments`).flush(initial.tournaments);
    httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/allregistrations`).flush(initial.registrations);
    httpMock.expectOne(`${shopService['_apiEndpoint']}/shopadmin/orders`).flush(initial.orders);
    // The embedded catalog and promo editors load their data on creation
    httpMock.expectOne(`${shopService['_apiEndpoint']}/shopadmin/products`).flush([]);
    httpMock.expectOne(`${shopService['_apiEndpoint']}/shopadmin/promos`).flush([]);
  };

  const el = (): HTMLElement => fixture.nativeElement;
  const render = async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  };

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

    // Triggers the constructor's and the template's HTTP requests
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('without data', () => {
    beforeEach(() => flushInitialRequests());

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

        // An existing (passed in) tournament is updated in place, so nothing is appended
        expect(component.tournaments()).toEqual([]);
      });

      it('should create a tournament using component property', () => {
        component.tournament = {
          name: 'New Tournament',
          description: 'Testing',
          startDate: new Date('2025-12-15'),
          endDate: new Date('2025-12-20'),
          active: true
        };
        component.tournaments.set([]);

        component.updateTournament();

        const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/create`);
        expect(req.request.method).toBe('PUT');

        const createdTournament: Tournament = { id: 'tournament-2', ...component.tournament };
        req.flush(createdTournament);

        expect(component.tournaments().length).toBe(1);
        // The new tournament form starts over, so submitting again doesn't resend the created tournament
        expect(component.tournament).toEqual(EMPTY_NEW_TOURNAMENT);
        expect(component.tournament).not.toBe(EMPTY_NEW_TOURNAMENT);
      });

      it('should start a new tournament list when none was loaded', () => {
        component.tournaments.set(null);

        component.updateTournament();

        const created: Tournament = { id: 'tournament-3', name: 'Created' };
        httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/create`).flush(created);

        expect(component.tournaments()).toEqual([created]);
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

        // Update the service's cached tournaments
        apiService['_tournaments'].set(mockTournaments);

        expect(component.tournaments()).toBeDefined();
        expect(component.tournaments().length).toBe(1);
        expect(component.tournaments()[0].startDate instanceof Date).toBe(true);
        expect(component.tournaments()[0].endDate instanceof Date).toBe(true);
      });

      it('should have no tournaments while the service has none', () => {
        apiService['_tournaments'].set(null);

        expect(component.tournaments()).toBeNull();
      });
    });

    describe('Order Management', () => {
      it('should mark an order as shipped with the tracking number', () => {
        const paidOrder = shopOrder();
        component.orders.set([paidOrder]);
        component.setTracking('order-1', 'SPD-123');

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
        const paidOrder = shopOrder();
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
        req.flush([shopOrder()]);

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
        // The row keeps the editor's value, so the grid doesn't consider it changed
        expect(gridEditEventArgs.rowData.state).toBe(true);

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
        expect(gridEditEventArgs.rowData.state).toBe(false);

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

    describe('Registration Management - saveRegistration', () => {
      const createMockRowContext = (key: string, deleted = true) => {
        const mockRowContext = createSpyObj('RowType', ['grid']);
        mockRowContext.grid = createSpyObj('IgxGridComponent', ['transactions']);
        mockRowContext.grid.transactions.commit = vi.fn();
        mockRowContext.grid.data = [];
        mockRowContext.key = key;
        mockRowContext.deleted = deleted;
        return mockRowContext;
      };

      it('should delete a registration marked deleted', () => {
        const mockRowContext = createMockRowContext('reg-1');

        component.saveRegistration(mockRowContext as any);

        expect(mockRowContext.grid.transactions.commit).toHaveBeenCalledWith([], 'reg-1');

        const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/delete?id=reg-1`);
        expect(req.request.method).toBe('DELETE');

        req.flush({});
      });

      it('should delete multiple registrations', () => {
        const rowContext1 = createMockRowContext('reg-1');
        const rowContext2 = createMockRowContext('reg-2');

        component.saveRegistration(rowContext1 as any);
        component.saveRegistration(rowContext2 as any);

        let req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/delete?id=reg-1`);
        expect(req.request.method).toBe('DELETE');
        req.flush({});

        req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/delete?id=reg-2`);
        expect(req.request.method).toBe('DELETE');
        req.flush({});
      });

      it('should commit transaction before deleting registration', () => {
        const mockRowContext = createMockRowContext('reg-1');
        mockRowContext.grid.data = [{ id: 'reg-1' }];

        component.saveRegistration(mockRowContext as any);

        expect(mockRowContext.grid.transactions.commit).toHaveBeenCalled();

        const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/delete?id=reg-1`);
        expect(req.request.method).toBe('DELETE');
        req.flush({});
      });

      it('should only commit the changes of an edited registration', () => {
        const mockRowContext = createMockRowContext('reg-1', false);

        component.saveRegistration(mockRowContext as any);

        expect(mockRowContext.grid.transactions.commit).toHaveBeenCalledWith([], 'reg-1');
        httpMock.expectNone(`${apiService['_apiEndpoint']}/tournament/delete?id=reg-1`);
      });
    });
  });

  describe('Roles', () => {
    // The grids' group-by areas are chips areas as well, so the roles area is the one labeled 'Roles'
    const rolesArea = () => Array.from(el().querySelectorAll('igx-chips-area')).find(a => a.querySelector(':scope > span')?.textContent === 'Roles');
    const chips = () => Array.from(rolesArea().querySelectorAll('igx-chip')).map(c => c.textContent.trim());
    const roleInput = () => el().querySelector<HTMLInputElement>('igx-chips-area ~ igx-input-group input');
    const roleSubmit = () => el().querySelector<HTMLButtonElement>('igx-chips-area ~ button');

    it('should list the defined roles', async () => {
      flushInitialRequests({ roles: ['admin', 'event-admin'] });
      await render();

      expect(chips()).toEqual(['admin', 'event-admin']);
    });

    it('should show a placeholder chip when no roles are returned', async () => {
      flushInitialRequests({ roles: null });
      await render();

      expect(component.roles()).toBeNull();
      expect(chips()).toEqual(['No Roles Defined']);
    });

    it('should submit a new role and reload the roles list', async () => {
      flushInitialRequests({ roles: ['admin'] });
      await render();

      roleInput().value = 'moderator';
      roleSubmit().click();

      const submit = httpMock.expectOne(`${apiService['_apiEndpoint']}/admin/createrole?rolename=moderator`);
      expect(submit.request.method).toBe('PUT');
      expect(submit.request.body).toBe('moderator');
      submit.flush('moderator');

      const reload = httpMock.expectOne(`${apiService['_apiEndpoint']}/admin/roles`);
      expect(reload.request.method).toBe('GET');
      reload.flush(['admin', 'moderator']);
      await render();

      expect(component.roles()).toEqual(['admin', 'moderator']);
      expect(chips()).toEqual(['admin', 'moderator']);
    });

    it('should label the new role input', async () => {
      flushInitialRequests();
      await render();

      expect(Array.from(roleInput().labels).map(l => l.textContent.trim())).toEqual(['New role']);
    });

    it('should give every text field of the page a label', async () => {
      flushInitialRequests({ tournaments: [{ id: 't1', name: 'Spring League' }] });
      await render();

      const fields = Array.from(el().querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input[igxInput], textarea[igxInput]'));
      expect(fields.length).toBeGreaterThan(0);
      const unlabeled = fields.filter(f => !f.labels?.length && !f.getAttribute('aria-label') && !f.getAttribute('aria-labelledby'));
      expect(unlabeled).toEqual([]);
    });
  });

  describe('Tournament forms', () => {
    const leagues = (): Tournament [] => [
      {
        id: 'league-1', name: 'Spring League', logo: '/logo.png', description: 'Spring season',
        startDate: '2026-03-01T00:00:00' as unknown as Date, endDate: '2026-05-01T00:00:00' as unknown as Date, active: false
      }
    ];
    // The shop catalog and promo editors have forms of their own, so only the tournaments section is searched
    const section = () => Array.from(el().querySelectorAll('h3')).find(h => h.textContent === 'Tournaments and Roles').closest('.content-container');
    const cards = () => Array.from(section().querySelectorAll('igx-card'));
    const forms = () => Array.from(section().querySelectorAll('form'));
    const newForm = () => el().querySelector('#newTournamentName').closest('form');
    const type = (input: HTMLInputElement | HTMLTextAreaElement, value: string) => {
      input.value = value;
      input.dispatchEvent(new Event('input'));
      input.dispatchEvent(new Event('blur'));
    };
    const pickers = (form: HTMLFormElement) => fixture.debugElement.queryAll(By.directive(IgxDatePickerComponent))
      .filter(d => form.contains(d.nativeElement))
      .map(d => d.componentInstance as IgxDatePickerComponent);
    const submitButton = (form: HTMLFormElement) => form.querySelector<HTMLButtonElement>('button[igxButton]');

    it('should render a card per tournament with its values bound to the editors', async () => {
      flushInitialRequests({ tournaments: leagues() });
      await render();

      expect(cards().length).toBe(1);
      expect(cards()[0].querySelector('h4').textContent).toContain('Spring League');
      expect(cards()[0].querySelector('h5').textContent).toContain('league-1');
      expect(cards()[0].querySelector<HTMLInputElement>('#leagueName0').value).toBe('Spring League');
      expect(cards()[0].querySelector<HTMLInputElement>('#leagueLogo0').value).toBe('/logo.png');
      expect(cards()[0].querySelector<HTMLTextAreaElement>('#leagueDescription0').value).toBe('Spring season');
      expect(pickers(forms()[0]).map(p => p.value)).toEqual([new Date('2026-03-01T00:00:00'), new Date('2026-05-01T00:00:00')]);
      // The form is valid but untouched, so it cannot be submitted yet
      expect(submitButton(forms()[0]).disabled).toBe(true);
    });

    it('should update an existing tournament from its card', async () => {
      flushInitialRequests({ tournaments: leagues() });
      await render();
      const form = forms()[0];

      type(form.querySelector<HTMLInputElement>('#leagueName0'), 'Summer League');
      type(form.querySelector<HTMLInputElement>('#leagueLogo0'), '/summer.png');
      type(form.querySelector<HTMLTextAreaElement>('#leagueDescription0'), 'Summer season');
      const [start, end] = pickers(form);
      start.value = new Date(2026, 5, 1);
      end.value = new Date(2026, 7, 1);
      form.querySelector<HTMLInputElement>('igx-checkbox input').click();
      await render();

      expect(submitButton(form).disabled).toBe(false);
      submitButton(form).click();

      const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/create`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(expect.objectContaining({
        id: 'league-1',
        name: 'Summer League',
        logo: '/summer.png',
        description: 'Summer season',
        startDate: new Date(2026, 5, 1),
        endDate: new Date(2026, 7, 1),
        active: true
      }));
      req.flush(req.request.body);
      await render();

      // Updating an existing tournament does not add a new card
      expect(cards().length).toBe(1);
    });

    const clearLabels = ['Clear tournament name', 'Clear tournament logo', 'Clear tournament description'];
    const clearButtons = (root: Element) => Array.from(root.querySelectorAll<HTMLButtonElement>('igx-suffix button'))
      .filter(b => !b.closest('igx-date-picker'));

    it('should clear the tournament fields from their named clear buttons', async () => {
      flushInitialRequests({ tournaments: leagues() });
      await render();
      const card = cards()[0];

      expect(clearButtons(card).map(b => b.getAttribute('aria-label'))).toEqual(clearLabels);
      clearButtons(card).forEach(b => {
        expect(b.type).toBe('button');
        b.click();
      });
      await render();

      expect(component.tournaments()[0]).toEqual(expect.objectContaining({ name: '', logo: '', description: '' }));
      expect(card.querySelector<HTMLInputElement>('#leagueName0').value).toBe('');
      expect(clearButtons(card).length).toBe(0);
    });

    it('should create a new tournament and list it', async () => {
      flushInitialRequests();
      await render();
      const form = newForm();
      const successes: string [] = [];
      TestBed.inject(CommunicationService).success.subscribe(m => successes.push(m));

      expect(cards().length).toBe(0);
      expect(submitButton(form).disabled).toBe(true);

      type(form.querySelector<HTMLInputElement>('[name="tournamentName"]'), 'Autumn League');
      type(form.querySelector<HTMLInputElement>('[name="tournamentLogo"]'), '/autumn.png');
      type(form.querySelector<HTMLTextAreaElement>('[name="tournamentDescription"]'), 'Autumn season');
      const [start, end] = pickers(form);
      start.value = new Date(2026, 8, 1);
      end.value = new Date(2026, 10, 1);
      await render();

      expect(submitButton(form).disabled).toBe(false);
      submitButton(form).click();

      const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/create`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(expect.objectContaining({
        id: '',
        name: 'Autumn League',
        logo: '/autumn.png',
        description: 'Autumn season',
        startDate: new Date(2026, 8, 1),
        endDate: new Date(2026, 10, 1)
      }));
      req.flush({ ...req.request.body, id: 'league-2' });
      await render();

      expect(successes).toEqual(['Tournament updated successfully!']);
      expect(cards().length).toBe(1);
      expect(cards()[0].querySelector('h4').textContent).toContain('Autumn League');
      expect(cards()[0].querySelector('h5').textContent).toContain('league-2');

      // The new tournament form is cleared, so it cannot resend the created tournament
      expect(component.tournament).toEqual(EMPTY_NEW_TOURNAMENT);
      expect(form.querySelector<HTMLInputElement>('#newTournamentName').value).toBe('');
      expect(form.querySelector<HTMLInputElement>('[name="tournamentLogo"]').value).toBe('');
      expect(form.querySelector<HTMLTextAreaElement>('[name="tournamentDescription"]').value).toBe('');
      expect(submitButton(form).disabled).toBe(true);
    });

    it('should label the new tournament name with an id of its own', async () => {
      // The registrations grid is grouped by its 'tournamentName' column, which renders a group-by chip
      flushInitialRequests({
        registrations: [{ id: 'reg-1', game: Game.CSGO, email: 'a@example.com', tournamentName: 'Spring League' }]
      });
      await render();

      const input = el().querySelector<HTMLInputElement>('#newTournamentName');
      expect(input.name).toBe('tournamentName');
      expect(el().querySelector<HTMLLabelElement>('label[for="newTournamentName"]').textContent).toContain('Tournament name');
      const ids = Array.from(el().querySelectorAll('[id]')).map(e => e.id).filter(id => id);
      expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([]);
    });

    it('should clear the new tournament fields from their named clear buttons', async () => {
      flushInitialRequests();
      await render();
      const form = newForm();

      expect(clearButtons(form).length).toBe(0);
      type(form.querySelector<HTMLInputElement>('[name="tournamentName"]'), 'Autumn League');
      type(form.querySelector<HTMLInputElement>('[name="tournamentLogo"]'), '/autumn.png');
      type(form.querySelector<HTMLTextAreaElement>('[name="tournamentDescription"]'), 'Autumn season');
      await render();

      expect(clearButtons(form).map(b => b.getAttribute('aria-label'))).toEqual(clearLabels);
      clearButtons(form).forEach(b => {
        // a plain button, so clearing a field does not submit the form (httpMock.verify checks nothing was sent)
        expect(b.type).toBe('button');
        b.click();
      });
      await render();

      expect(component.tournament).toEqual(expect.objectContaining({ name: '', logo: '', description: '' }));
      expect(form.querySelector<HTMLInputElement>('[name="tournamentName"]').value).toBe('');
      expect(clearButtons(form).length).toBe(0);
      expect(submitButton(form).disabled).toBe(true);
    });
  });

  describe('Registrations grid', () => {
    const registrations = (): TournamentApplication [] => [
      {
        id: 'reg-1', game: Game.StarCraft2, email: 'alpha@example.com', battleNetId: 'Alpha#123', country: 'BG', discord: 'alpha',
        tournamentName: 'Spring League', state: TournamentApplicationState.Confirmed
      },
      {
        id: 'reg-2', game: Game.CSGO, email: 'bravo@example.com', battleNetId: 'Bravo#456', country: 'RO', discord: 'bravo',
        tournamentName: 'Spring League', state: TournamentApplicationState.Pending
      }
    ];
    const grid = () => fixture.debugElement.queryAll(By.directive(IgxGridComponent))[0].componentInstance as IgxGridComponent;
    const actionStrip = () => grid().actionStrip as IgxActionStripComponent;
    const stripButton = (title: string) => grid().nativeElement.querySelector<HTMLButtonElement>(`igx-action-strip button[title="${title}"]`);
    const hoverRow = async (key: string) => {
      grid().dataRowList.find(r => r.key === key).nativeElement.dispatchEvent(new MouseEvent('mouseenter'));
      await render();
    };
    const groupLabels = () => Array.from<HTMLElement>(grid().nativeElement.querySelectorAll('.igx-group-label'))
      .map(g => [
        g.querySelector('.igx-group-label__column-name').textContent.trim(),
        g.querySelector('.igx-group-label__text').textContent.trim(),
        g.querySelector('igx-badge').textContent.trim()
      ].join(' '));
    const cellElement = (key: string, field: string): HTMLElement => grid().dataRowList.find(r => r.key === key).cells
      .find(c => c.column.field === field).nativeElement;
    const stateIcon = (key: string) => cellElement(key, 'state').querySelector('igx-icon');

    beforeEach(async () => {
      flushInitialRequests({ registrations: registrations() });
      await render();
    });

    it('should group the registrations by league, collapsed', () => {
      expect(groupLabels()).toEqual(['League: Spring League 2']);
      expect(grid().dataRowList.length).toBe(0);
    });

    it('should name the games in the group rows and show the confirmed state of each registration', async () => {
      grid().toggleAllGroupRows();
      await render();

      expect(groupLabels()).toEqual([
        'League: Spring League 2',
        'Game: Counter-Strike 1',
        'Game: StarCraft II 1'
      ]);
      expect(stateIcon('reg-1').textContent.trim()).toBe('check');
      expect(stateIcon('reg-1').classList).toContain('color-success');
      expect(stateIcon('reg-2').textContent.trim()).toBe('close');
      expect(stateIcon('reg-2').classList).toContain('color-error');
    });

    it('should name the game in its cells when the game column is shown', async () => {
      grid().toggleAllGroupRows();
      grid().getColumnByName('game').hidden = false;
      await render();

      expect(cellElement('reg-1', 'game').textContent.trim()).toBe('StarCraft II');
      expect(cellElement('reg-2', 'game').textContent.trim()).toBe('Counter-Strike');
    });

    it('should confirm a registration when its state cell is edited', async () => {
      grid().toggleAllGroupRows();
      await render();
      const cell = grid().getCellByKey('reg-2', 'state');

      cell.editMode = true;
      cell.editValue = true;
      grid().endEdit(true);

      const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/confirm?id=reg-2`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(expect.objectContaining({ id: 'reg-2', state: TournamentApplicationState.Confirmed }));
      req.flush({});

      // The edit is saved right away, so the row has no pending changes left to save
      await hoverRow('reg-2');
      expect(grid().dataRowList.find(r => r.key === 'reg-2').dirty).toBe(false);
      expect(stripButton('Save')).toBeNull();
      expect(stripButton('Delete')).toBeTruthy();
    });

    it('should keep an edited registration when its pending changes are saved', async () => {
      grid().toggleAllGroupRows();
      await render();

      // Editing through the API leaves the change pending in the batch
      grid().updateCell(true, 'reg-2', 'state');
      await hoverRow('reg-2');
      expect(grid().dataRowList.find(r => r.key === 'reg-2').dirty).toBe(true);

      stripButton('Save').click();
      await render();

      httpMock.expectNone(`${apiService['_apiEndpoint']}/tournament/delete?id=reg-2`);
      expect(grid().transactions.getAggregatedChanges(false)).toEqual([]);
      expect(grid().data.map(r => r.id)).toEqual(['reg-1', 'reg-2']);
      expect(grid().data[1].state).toBe(true);
    });

    it('should only offer to delete a pristine registration', async () => {
      grid().toggleAllGroupRows();
      await render();

      await hoverRow('reg-1');

      expect(actionStrip().context.key).toBe('reg-1');
      expect(stripButton('Save')).toBeNull();
      expect(stripButton('Delete')).toBeTruthy();
    });

    it('should mark a registration deleted and remove it on save', async () => {
      grid().toggleAllGroupRows();
      await render();

      await hoverRow('reg-1');
      stripButton('Delete').click();
      await render();

      expect(grid().getRowByKey('reg-1').deleted).toBe(true);
      expect(stripButton('Delete')).toBeNull();

      stripButton('Save').click();

      const req = httpMock.expectOne(`${apiService['_apiEndpoint']}/tournament/delete?id=reg-1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});

      expect(grid().transactions.getAggregatedChanges(false)).toEqual([]);
      expect(grid().data.map(r => r.id)).toEqual(['reg-2']);
    });
  });

  describe('Orders grid', () => {
    const orders = (): ShopOrder [] => [
      shopOrder({
        postalCode: '1000', promoCode: 'EBL10', customerNote: 'Please call first',
        items: [
          { id: 1, productId: 'p-1', productName: 'Jersey', variantName: 'Male L', unitPrice: 30, quantity: 2, lineTotal: 60 },
          { id: 2, productId: 'p-2', productName: 'Mousepad', unitPrice: 15, quantity: 1, lineTotal: 15 }
        ]
      }),
      shopOrder({
        id: 'order-2', orderSequence: 2, orderNumber: 'BG-2026-000002', firstName: 'Jane', lastName: 'Roe',
        status: OrderStatus.AwaitingPayment, deliveryMethod: DeliveryMethod.EventPickup
      })
    ];
    const grid = () => fixture.debugElement.queryAll(By.directive(IgxGridComponent))[1].componentInstance as IgxGridComponent;
    const cell = (field: string, key = 'order-1'): HTMLElement => grid().dataRowList.find(r => r.key === key).cells
      .find(c => c.column.field === field).nativeElement;
    const cellText = (field: string, key = 'order-1') => cell(field, key).textContent.replace(/\s+/g, ' ').trim();
    const details = () => grid().nativeElement.querySelector<HTMLElement>('.order-details');
    const detailButton = (text: string) => Array.from(details().querySelectorAll<HTMLButtonElement>('.order-actions button'))
      .find(b => b.textContent.includes(text));

    beforeEach(async () => {
      flushInitialRequests({ orders: orders() });
      await render();
    });

    it('should render the order details', () => {
      expect(cellText('orderNumber')).toContain('BG-2026-000001');
      expect(cellText('status')).toBe('Paid');
      expect(cell('status').querySelector('.order-status').classList).toContain('status-1');
      expect(cellText('email')).toBe('test@example.com');
      expect(cellText('name')).toBe('John Doe');
      expect(cellText('address')).toBe('bul. Vitosha 1, 1000 Sofia');
      expect(cellText('deliveryMethod')).toBe('Courier delivery');
      expect(cellText('promoCode')).toBe('EBL10');

      expect(cellText('status', 'order-2')).toBe('Awaiting payment');
      expect(cellText('deliveryMethod', 'order-2')).toBe('Pick up at an event');
    });

    it('should list the ordered items and the customer note when an order is expanded', async () => {
      expect(details()).toBeNull();

      grid().expandRow('order-1');
      await render();

      const items = Array.from(details().querySelectorAll('.order-items li'))
        .map(li => ['.item-qty', '.item-name', '.item-total'].map(part => li.querySelector(part).textContent.trim()));
      // The variant is set apart from the product name by its margin
      expect(items).toEqual([
        ['2 ×', 'Jersey(Male L)', '€60.00'],
        ['1 ×', 'Mousepad', '€15.00']
      ]);
      expect(details().querySelector('.order-note').textContent).toContain('Please call first');
    });

    it('should ship a paid order with the tracking number typed in its details', async () => {
      grid().expandRow('order-1');
      await render();

      const tracking = details().querySelector<HTMLInputElement>('#tracking-order-1');
      tracking.value = 'SPD-123';
      tracking.dispatchEvent(new Event('input'));
      detailButton('Mark shipped').click();

      const req = httpMock.expectOne(`${shopService['_apiEndpoint']}/shopadmin/orders/order-1/status`);
      expect(req.request.body).toEqual({ status: OrderStatus.Shipped, trackingNumber: 'SPD-123' });
      req.flush({ ...orders()[0], status: OrderStatus.Shipped, trackingNumber: 'SPD-123' });
      await render();

      expect(cellText('status')).toBe('Shipped');
      expect(cellText('trackingNumber')).toBe('SPD-123');
    });

    it('should only offer to cancel an order that awaits payment', async () => {
      grid().expandRow('order-2');
      await render();

      expect(details().querySelector('input')).toBeNull();
      expect(detailButton('Refund')).toBeUndefined();

      detailButton('Cancel order').click();

      const req = httpMock.expectOne(`${shopService['_apiEndpoint']}/shopadmin/orders/order-2/status`);
      expect(req.request.body).toEqual({ status: OrderStatus.Cancelled, trackingNumber: null });
      req.flush({ ...orders()[1], status: OrderStatus.Cancelled });
      await render();

      expect(cellText('status', 'order-2')).toBe('Cancelled');
    });
  });
});
