import { Component, inject, signal } from '@angular/core';
import {
  LoginService,
  ApiTournamentsService,
  Tournament, EMPTY_NEW_TOURNAMENT, TournamentApplication,
  ApiShopService,
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
  styleUrls: ['./admin-main.component.scss'],  imports: [
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

  public roles: string [];
  public tournaments: Tournament [];
  public tournament = Object.assign({}, EMPTY_NEW_TOURNAMENT);
  public orders = signal<ShopOrder []>([]);
  public registrations: TournamentApplication [];
  public grouping: IGroupingExpression [];

  public OrderStatus = OrderStatus;
  public statusNames = ORDER_STATUS_NAMES;
  public deliveryNames = DELIVERY_METHOD_NAMES;
  public ordersExportUrl = this.shopService.ordersExportUrl;
  /** Tracking numbers typed in the order detail rows, keyed by order id. */
  public tracking: Record<string, string> = {};

  constructor() {
    this.authService.getUserRoles().subscribe(data => this.roles = data);
    this.apiService.tournaments.subscribe(data => {
      if (data) {
        data.forEach(t => {
          t.startDate = new Date(t.startDate);
          t.endDate = new Date(t.endDate);
        });
        this.tournaments = data;
      }
    });
    this.loadOrders();
    this.apiService.allRegistrations.subscribe(data => this.registrations = data);
    this.grouping = [
      { dir: SortingDirection.Desc, fieldName: 'tournamentName', ignoreCase: false, strategy: DefaultSortingStrategy.instance() },
      { dir: SortingDirection.Asc, fieldName: 'game', ignoreCase: false, strategy: DefaultSortingStrategy.instance() }
    ];
  }

  public submitRole(role: string) {
    this.authService.submitRole(role).subscribe(() => this.authService.getUserRoles().subscribe(roles => this.roles = roles));
  }

  public updateTournament(tournament?: Tournament) {
    this.apiService.createTournament(tournament || this.tournament).subscribe(data => !tournament ? this.tournaments.push(data) : null);
  }

  public loadOrders() {
    this.shopService.getAdminOrders().subscribe(orders => this.orders.set(orders));
  }

  public statusName(status: OrderStatus) {
    return this.statusNames[status];
  }

  public updateOrderStatus(order: ShopOrder, status: OrderStatus) {
    this.shopService.updateOrderStatus(order.id, { status, trackingNumber: this.tracking[order.id] || order.trackingNumber || null })
      .subscribe(updated => this.replaceOrder(updated));
  }

  public refundOrder(order: ShopOrder) {
    this.shopService.refundOrder(order.id).subscribe(updated => this.replaceOrder(updated));
  }

  public confirmRegistration(event: IGridEditEventArgs) {
    const rowData = event.rowData;
    rowData[event.column.field] = event.newValue ? 1 : 0;
    this.apiService.confirmRegistration(rowData).subscribe();
  }

  public deleteRegistration(rowContext: RowType) {
    rowContext.grid.transactions.commit(rowContext.grid.data, rowContext.key);
    this.apiService.deleteRegistration(rowContext.key).subscribe();
  }

  private replaceOrder(updated: ShopOrder) {
    this.orders.update(orders => orders.map(o => o.id === updated.id ? { ...o, ...updated } : o));
  }
}
