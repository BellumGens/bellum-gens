import { ChangeDetectionStrategy, Component, DOCUMENT, OnDestroy, PLATFORM_ID, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IgxButtonDirective, IgxDividerComponent, IgxRippleDirective } from '@infragistics/igniteui-angular/directives';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
import { IgxCircularProgressBarComponent } from '@infragistics/igniteui-angular/progressbar';
import { ApiShopService } from '../../../services/bellumgens-api.shop.service';
import { CartService } from '../../../services/cart.service';
import { DELIVERY_METHOD_NAMES, ORDER_STATUS_NAMES, OrderStatus, OrderStatusView, PaymentStatus } from '../../../models/shop';

@Component({
  selector: 'bg-order-status',
  imports: [
    CurrencyPipe,
    DatePipe,
    RouterLink,
    IgxButtonDirective,
    IgxRippleDirective,
    IgxDividerComponent,
    IgxIconComponent,
    IgxCircularProgressBarComponent
  ],
  templateUrl: './order-status.component.html',
  styleUrl: './order-status.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OrderStatusComponent implements OnDestroy {
  /** How often the page asks the API while a payment is still pending. */
  public static readonly pollIntervalMs = 3000;
  /** After this long the page stops polling and offers a manual refresh. */
  public static readonly pollTimeoutMs = 120000;

  private route = inject(ActivatedRoute);
  private shopApi = inject(ApiShopService);
  private cart = inject(CartService);
  private document = inject(DOCUMENT);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  public order = signal<OrderStatusView | null>(null);
  public notFound = signal(false);
  public polling = signal(false);
  public timedOut = signal(false);
  public busy = signal(false);

  public statusNames = ORDER_STATUS_NAMES;
  public deliveryNames = DELIVERY_METHOD_NAMES;
  public OrderStatus = OrderStatus;

  private orderId = '';
  private pollStarted = 0;
  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.route.paramMap.pipe(takeUntilDestroyed()).subscribe(params => {
      this.orderId = params.get('id') ?? '';
      this.pollStarted = Date.now();
      this.timedOut.set(false);
      this.load();
    });
  }

  public get awaitingPayment() {
    const order = this.order();
    return !!order && order.status === OrderStatus.AwaitingPayment;
  }

  public get paymentPending() {
    const order = this.order();
    return this.awaitingPayment && (order?.paymentStatus === PaymentStatus.Pending || order?.paymentStatus === PaymentStatus.Authorised);
  }

  public statusIcon(status: OrderStatus) {
    switch (status) {
      case OrderStatus.Paid: return 'check_circle';
      case OrderStatus.Shipped: return 'local_shipping';
      case OrderStatus.Delivered: return 'inventory_2';
      case OrderStatus.Cancelled: return 'cancel';
      case OrderStatus.Refunded: return 'undo';
      default: return 'hourglass_top';
    }
  }

  public refresh() {
    this.pollStarted = Date.now();
    this.timedOut.set(false);
    this.load();
  }

  public payNow() {
    const url = this.order()?.checkoutUrl;
    if (url) {
      this.document.location.assign(url);
    }
  }

  public retryPayment() {
    this.busy.set(true);
    this.shopApi.retryPayment(this.orderId).subscribe({
      next: created => this.document.location.assign(created.checkoutUrl),
      error: () => {
        this.busy.set(false);
        this.load();
      }
    });
  }

  public ngOnDestroy() {
    this.stopPolling();
  }

  private load() {
    this.stopPolling();
    if (!this.orderId) {
      this.notFound.set(true);
      return;
    }
    this.shopApi.getOrder(this.orderId).subscribe({
      next: order => {
        this.order.set(order);
        this.notFound.set(false);
        if (order.status === OrderStatus.Paid) {
          this.cart.clear();
        }
        this.schedulePoll(order);
      },
      error: error => {
        if (error.status === 404) {
          this.notFound.set(true);
        }
        this.polling.set(false);
      }
    });
  }

  private schedulePoll(order: OrderStatusView) {
    const pending = order.status === OrderStatus.AwaitingPayment
      && (order.paymentStatus === PaymentStatus.Pending || order.paymentStatus === PaymentStatus.Authorised);
    if (!this.isBrowser || !pending) {
      this.polling.set(false);
      return;
    }
    if (Date.now() - this.pollStarted >= OrderStatusComponent.pollTimeoutMs) {
      this.polling.set(false);
      this.timedOut.set(true);
      return;
    }
    this.polling.set(true);
    this.timer = setTimeout(() => this.load(), OrderStatusComponent.pollIntervalMs);
  }

  private stopPolling() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }
}
