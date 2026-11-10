import { Component, DestroyRef, computed, effect, inject, signal, untracked } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { IgxButtonDirective, IgxRippleDirective } from '@infragistics/igniteui-angular/directives';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
import { IgxCircularProgressBarComponent } from '@infragistics/igniteui-angular/progressbar';
import { IGX_LIST_DIRECTIVES } from '@infragistics/igniteui-angular/list';
import { ApiShopService, LoginService } from 'bellum-gens-common/services';
import { ORDER_STATUS_ICONS, ORDER_STATUS_NAMES, OrderStatusView } from 'bellum-gens-common/models';

/** The orders the signed-in customer placed from their account, the most recent first. */
@Component({
  selector: 'bg-order-history',
  imports: [
    CurrencyPipe,
    DatePipe,
    RouterLink,
    IgxButtonDirective,
    IgxRippleDirective,
    IgxIconComponent,
    IgxCircularProgressBarComponent,
    IGX_LIST_DIRECTIVES
  ],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.scss'
})
export class OrderHistoryComponent {
  private shopApi = inject(ApiShopService);
  private login = inject(LoginService);

  private loaded = signal<OrderStatusView[] | null>(null);
  private request: Subscription | null = null;

  public user = this.login.applicationUser;
  public userCheck = this.login.userCheckInProgress;
  /** The orders of the signed-in user, the most recent first; null until they are loaded. */
  public orders = computed(() => {
    const orders = this.loaded();
    return orders && [...orders].sort((a, b) => Date.parse(b.orderDate) - Date.parse(a.orderDate));
  });
  public loadFailed = signal(false);

  public statusNames = ORDER_STATUS_NAMES;
  public statusIcons = ORDER_STATUS_ICONS;

  private userId = computed(() => this.user()?.id ?? null);

  constructor() {
    // Loads the orders of whoever signs in, and forgets them on sign out.
    effect(() => {
      const userId = this.userId();
      untracked(() => {
        this.cancel();
        this.loaded.set(null);
        this.loadFailed.set(false);
        if (userId) {
          this.load();
        }
      });
    });
    inject(DestroyRef).onDestroy(() => this.cancel());
  }

  public signIn() {
    this.login.emitOpenLogin();
  }

  public load() {
    this.cancel();
    this.loadFailed.set(false);
    this.request = this.shopApi.getMyOrders().subscribe({
      next: orders => this.loaded.set(orders),
      error: () => this.loadFailed.set(true)
    });
  }

  /** What was ordered, e.g. "2 × Jersey (M), 1 × Pen". */
  public summary(order: OrderStatusView) {
    return order.items
      .map(item => `${item.quantity} × ${item.productName}${item.variantName ? ` (${item.variantName})` : ''}`)
      .join(', ');
  }

  private cancel() {
    this.request?.unsubscribe();
    this.request = null;
  }
}
