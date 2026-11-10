import { Component, inject, linkedSignal, signal } from '@angular/core';
import { LoginService, ApiTournamentsService, ApiShopService } from 'bellum-gens-common/services';
import {
  Tournament,
  EMPTY_NEW_TOURNAMENT,
  TournamentApplicationState,
  ShopOrder,
  OrderStatus,
  PaymentStatus,
  ORDER_STATUS_NAMES,
  DELIVERY_METHOD_NAMES,
  DeliveryMethod,
  PAYMENT_METHOD_NAMES,
  PaymentMethod
} from 'bellum-gens-common/models';
import { ProductEditorComponent, PromoEditorComponent, ConfirmComponent } from 'bellum-gens-common';
import { IGridEditEventArgs, IgxExporterEvent, RowType } from '@infragistics/igniteui-angular/grids/core';
import { DefaultSortingStrategy, IGroupingExpression, SortingDirection } from '@infragistics/igniteui-angular/core';
import { IGX_GRID_DIRECTIVES } from '@infragistics/igniteui-angular/grids/grid';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
import { IgxBadgeComponent } from '@infragistics/igniteui-angular/badge';
import { IGX_ACTION_STRIP_DIRECTIVES } from '@infragistics/igniteui-angular/action-strip';
import { IgxButtonDirective, IgxIconButtonDirective, IgxRippleDirective } from '@infragistics/igniteui-angular/directives';
import { IGX_PAGINATOR_DIRECTIVES } from '@infragistics/igniteui-angular/paginator';
import { IGX_INPUT_GROUP_DIRECTIVES } from '@infragistics/igniteui-angular/input-group';
import { IGX_DATE_PICKER_DIRECTIVES } from '@infragistics/igniteui-angular/date-picker';
import { IgxCheckboxComponent } from '@infragistics/igniteui-angular/checkbox';
import { IGX_CHIPS_DIRECTIVES } from '@infragistics/igniteui-angular/chips';
import { IGX_CARD_DIRECTIVES } from '@infragistics/igniteui-angular/card';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

// The API sends the tournament dates as ISO strings
const toDate = (value?: Date | string): Date | undefined => value ? new Date(value) : undefined;

@Component({
  selector: 'app-admin-main',
  templateUrl: './admin-main.component.html',
  styleUrls: ['./admin-main.component.scss'],
  imports: [
    FormsModule,
    CurrencyPipe,
    IGX_GRID_DIRECTIVES,
    IgxIconComponent,
    IgxBadgeComponent,
    IGX_ACTION_STRIP_DIRECTIVES,
    IgxButtonDirective,
    IgxIconButtonDirective,
    IgxRippleDirective,
    IGX_PAGINATOR_DIRECTIVES,
    IGX_INPUT_GROUP_DIRECTIVES,
    IGX_DATE_PICKER_DIRECTIVES,
    IGX_CARD_DIRECTIVES,
    IgxCheckboxComponent,
    IGX_CHIPS_DIRECTIVES,
    ProductEditorComponent,
    PromoEditorComponent,
    ConfirmComponent
  ]
})
export class AdminMainComponent {
  private authService = inject(LoginService);
  private apiService = inject(ApiTournamentsService);
  private shopService = inject(ApiShopService);

  public roles = signal<string [] | null>(null);
  // public users: AdminAppUserSummary [];
  private allTournaments = this.apiService.tournaments;
  // A local copy with parsed dates for the grid's date editors; tournaments created here are appended to it
  public tournaments = linkedSignal<Tournament [] | null>(() => this.allTournaments()?.map(t => ({
    ...t,
    startDate: toDate(t.startDate),
    endDate: toDate(t.endDate)
  })) ?? null);
  public tournament = Object.assign({}, EMPTY_NEW_TOURNAMENT);
  public orders = signal<ShopOrder []>([]);
  public registrations = this.apiService.allRegistrations;
  public grouping: IGroupingExpression [] = [
    { dir: SortingDirection.Desc, fieldName: 'tournamentName', ignoreCase: false, strategy: DefaultSortingStrategy.instance() },
    { dir: SortingDirection.Asc, fieldName: 'game', ignoreCase: false, strategy: DefaultSortingStrategy.instance() }
  ];

  public OrderStatus = OrderStatus;
  public PaymentMethod = PaymentMethod;
  public statusNames = ORDER_STATUS_NAMES;
  public deliveryNames = DELIVERY_METHOD_NAMES;
  public paymentNames = PAYMENT_METHOD_NAMES;

  // Column formatters: the cell templates show these values in the grid, and the exporter writes them to the file.
  public formatStatus = (status: OrderStatus) => this.statusNames[status] ?? '';
  public formatDelivery = (method: DeliveryMethod) => this.deliveryNames[method] ?? '';
  public formatPayment = (method: PaymentMethod) => this.paymentNames[method] ?? '';
  public formatName = (_: unknown, order?: ShopOrder) => order ? `${order.firstName} ${order.lastName}`.trim() : '';
  /** Empty for an order picked up at an event, which has no address. */
  public formatAddress = (_: unknown, order?: ShopOrder) => {
    if (!order) {
      return '';
    }
    const place = [order.postalCode, order.city].filter(Boolean).join(' ');
    return [order.streetAddress, place].filter(Boolean).join(', ');
  };
  /** One line per order, e.g. "2× Umbrella | 1× Jersey (Male / L)". */
  public formatItems = (items: ShopOrder['items'] | null | undefined) => (items ?? [])
    .map(item => `${item.quantity}× ${item.productName}${item.variantName ? ` (${item.variantName})` : ''}`)
    .join(' | ');
  /** Tracking numbers typed in the order detail rows, keyed by order id. */
  public tracking = signal<Record<string, string>>({});

  constructor() {
    this.authService.getUserRoles().subscribe(data => this.roles.set(data));
    // this.authService.getUsers().subscribe(data => this.users = data);
    this.loadOrders();
  }

  public submitRole(role: string) {
    this.authService.submitRole(role).subscribe(() => this.authService.getUserRoles().subscribe(roles => this.roles.set(roles)));
  }

  public updateTournament(tournament?: Tournament) {
    this.apiService.createTournament(tournament || this.tournament).subscribe(data => {
      if (!tournament) {
        this.tournaments.update(tournaments => [...(tournaments || []), data]);
        // Start the next new tournament from a blank form
        this.tournament = Object.assign({}, EMPTY_NEW_TOURNAMENT);
      }
    });
  }

  public loadOrders() {
    this.shopService.getAdminOrders().subscribe(orders => this.orders.set(orders));
  }

  public statusName(status: OrderStatus) {
    return this.statusNames[status];
  }

  public deliveryName(method: DeliveryMethod) {
    return this.deliveryNames[method];
  }

  public paymentName(method: PaymentMethod) {
    return this.paymentNames[method];
  }

  /** The Items column is hidden in the grid but belongs in the exported file. */
  public includeHiddenColumns(event: IgxExporterEvent) {
    event.options.ignoreColumnsVisibility = true;
  }

  public updateOrderStatus(order: ShopOrder, status: OrderStatus) {
    this.shopService.updateOrderStatus(order.id, { status, trackingNumber: this.tracking()[order.id] || order.trackingNumber || null })
      .subscribe(updated => this.replaceOrder(updated));
  }

  public setTracking(orderId: string, trackingNumber: string) {
    this.tracking.update(tracking => ({ ...tracking, [orderId]: trackingNumber }));
  }

  /**
   * Paid orders can be refunded, and so can a cancelled order holding a completed payment: one that was paid after
   * it expired, when its stock was no longer available. Cash on delivery was paid to the courier, not through Revolut,
   * so it cannot be refunded from here.
   */
  public canRefund(order: ShopOrder) {
    if (order.paymentMethod === PaymentMethod.CashOnDelivery) {
      return false;
    }
    switch (order.status) {
      case OrderStatus.Paid:
      case OrderStatus.Shipped:
      case OrderStatus.Delivered:
        return true;
      case OrderStatus.Cancelled:
        return !!order.payments?.some(payment => payment.status === PaymentStatus.Completed);
      default:
        return false;
    }
  }

  public refundOrder(order: ShopOrder) {
    this.shopService.refundOrder(order.id).subscribe(updated => this.replaceOrder(updated));
  }

  public confirmRegistration(event: IGridEditEventArgs) {
    const rowData = event.rowData;
    const field = event.column?.field;
    if (!field) {
      return;
    }
    // The row keeps the editor's boolean, so the grid sees no pending change once it's saved;
    // the server receives the state as a number
    rowData[field] = event.newValue;
    this.apiService.confirmRegistration({
      ...rowData,
      [field]: event.newValue ? TournamentApplicationState.Confirmed : TournamentApplicationState.Pending
    }).subscribe();
  }

  // Applies the row's pending changes and deletes it on the server only if it was marked deleted
  public saveRegistration(rowContext: RowType) {
    const deleted = rowContext.deleted;
    rowContext.grid.transactions.commit(rowContext.grid.data ?? [], rowContext.key);
    if (deleted) {
      this.apiService.deleteRegistration(rowContext.key).subscribe();
    }
  }

  private replaceOrder(updated: ShopOrder) {
    this.orders.update(orders => orders.map(o => o.id === updated.id ? { ...o, ...updated } : o));
  }
}
