import { Component, inject, linkedSignal, signal } from '@angular/core';
import {
  LoginService,
  ApiTournamentsService,
  Tournament, EMPTY_NEW_TOURNAMENT,
  ApiShopService,
  TournamentApplicationState,
  ShopOrder,
  OrderStatus,
  ORDER_STATUS_NAMES,
  DELIVERY_METHOD_NAMES,
  ProductEditorComponent,
  PromoEditorComponent
} from '../../../../../common/src/public_api';
import { IGridEditEventArgs, RowType } from '@infragistics/igniteui-angular/grids/core';
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
    PromoEditorComponent
  ]
})
export class AdminMainComponent {
  private authService = inject(LoginService);
  private apiService = inject(ApiTournamentsService);
  private shopService = inject(ApiShopService);

  public roles = signal<string []>(null);
  // public users: AdminAppUserSummary [];
  private allTournaments = this.apiService.tournaments;
  // A local copy with parsed dates for the grid's date editors; tournaments created here are appended to it
  public tournaments = linkedSignal<Tournament []>(() => this.allTournaments()?.map(t => ({
    ...t,
    startDate: new Date(t.startDate),
    endDate: new Date(t.endDate)
  })) ?? null);
  public tournament = Object.assign({}, EMPTY_NEW_TOURNAMENT);
  public orders = signal<ShopOrder []>([]);
  public registrations = this.apiService.allRegistrations;
  public grouping: IGroupingExpression [] = [
    { dir: SortingDirection.Desc, fieldName: 'tournamentName', ignoreCase: false, strategy: DefaultSortingStrategy.instance() },
    { dir: SortingDirection.Asc, fieldName: 'game', ignoreCase: false, strategy: DefaultSortingStrategy.instance() }
  ];

  public OrderStatus = OrderStatus;
  public statusNames = ORDER_STATUS_NAMES;
  public deliveryNames = DELIVERY_METHOD_NAMES;
  public ordersExportUrl = this.shopService.ordersExportUrl;
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

  public updateOrderStatus(order: ShopOrder, status: OrderStatus) {
    this.shopService.updateOrderStatus(order.id, { status, trackingNumber: this.tracking()[order.id] || order.trackingNumber || null })
      .subscribe(updated => this.replaceOrder(updated));
  }

  public setTracking(orderId: string, trackingNumber: string) {
    this.tracking.update(tracking => ({ ...tracking, [orderId]: trackingNumber }));
  }

  public refundOrder(order: ShopOrder) {
    this.shopService.refundOrder(order.id).subscribe(updated => this.replaceOrder(updated));
  }

  public confirmRegistration(event: IGridEditEventArgs) {
    const rowData = event.rowData;
    // The row keeps the editor's boolean, so the grid sees no pending change once it's saved;
    // the server receives the state as a number
    rowData[event.column.field] = event.newValue;
    this.apiService.confirmRegistration({
      ...rowData,
      [event.column.field]: event.newValue ? TournamentApplicationState.Confirmed : TournamentApplicationState.Pending
    }).subscribe();
  }

  // Applies the row's pending changes and deletes it on the server only if it was marked deleted
  public saveRegistration(rowContext: RowType) {
    const deleted = rowContext.deleted;
    rowContext.grid.transactions.commit(rowContext.grid.data, rowContext.key);
    if (deleted) {
      this.apiService.deleteRegistration(rowContext.key).subscribe();
    }
  }

  private replaceOrder(updated: ShopOrder) {
    this.orders.update(orders => orders.map(o => o.id === updated.id ? { ...o, ...updated } : o));
  }
}
