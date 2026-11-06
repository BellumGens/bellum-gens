import { Component, DOCUMENT, DestroyRef, LOCALE_ID, PLATFORM_ID, computed, effect, inject, signal, untracked } from '@angular/core';
import { CurrencyPipe, isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IGX_INPUT_GROUP_DIRECTIVES } from '@infragistics/igniteui-angular/input-group';
import { IgxButtonDirective, IgxDividerComponent, IgxRippleDirective } from '@infragistics/igniteui-angular/directives';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
import { IgxCheckboxComponent } from '@infragistics/igniteui-angular/checkbox';
import { IgxCircularProgressBarComponent } from '@infragistics/igniteui-angular/progressbar';
import { ApiShopService, orderProblems } from '../../../services/bellumgens-api.shop.service';
import { CartService, fingerprint } from '../../../services/cart.service';
import { LoginService } from '../../../services/login.service';
import { EMAIL_REGEX } from '../../../models/misc';
import { DELIVERY_METHOD_NAMES, DeliveryMethod, OrderRequest, OrderStatus } from '../../../models/shop';

/** Where to send the customer once the order is ready: the provider's checkout, or the order page. */
type CheckoutTarget = { checkoutUrl: string } | { orderId: string };

const PAID_STATUSES = [OrderStatus.Paid, OrderStatus.Shipped, OrderStatus.Delivered];

@Component({
  selector: 'bg-checkout',
  imports: [
    CurrencyPipe,
    RouterLink,
    ReactiveFormsModule,
    IGX_INPUT_GROUP_DIRECTIVES,
    IgxButtonDirective,
    IgxRippleDirective,
    IgxDividerComponent,
    IgxIconComponent,
    IgxCheckboxComponent,
    IgxCircularProgressBarComponent
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
  public cart = inject(CartService);
  private fb = inject(NonNullableFormBuilder);
  private shopApi = inject(ApiShopService);
  private login = inject(LoginService);
  private router = inject(Router);
  private locale = inject(LOCALE_ID);
  private document = inject(DOCUMENT);
  private destroyRef = inject(DestroyRef);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  public deliveryNames = DELIVERY_METHOD_NAMES;
  public submitting = signal(false);
  public problems = signal<string[]>([]);
  /** Only courier delivery needs an address; an order picked up at an event has none. */
  public courier = computed(() => this.cart.deliveryMethod() === DeliveryMethod.Courier);

  public form = this.fb.group({
    firstName: ['', [Validators.required, Validators.maxLength(100)]],
    lastName: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.pattern(EMAIL_REGEX)]],
    phoneNumber: ['+359 ', [Validators.required, Validators.pattern(/^\+?(?=(?:\D*\d){6})[0-9 ()-]{6,20}$/)]],
    city: ['', [Validators.required, Validators.maxLength(100)]],
    streetAddress: ['', [Validators.required, Validators.maxLength(200)]],
    postalCode: ['', [Validators.maxLength(10)]],
    customerNote: ['', [Validators.maxLength(1000)]],
    acceptedTerms: [false, [Validators.requiredTrue]]
  });

  constructor() {
    // Disabled controls are not validated, so the address is only required while it is shown.
    effect(() => {
      const courier = this.courier();
      const { city, streetAddress, postalCode } = this.form.controls;
      for (const control of [city, streetAddress, postalCode]) {
        if (courier) {
          control.enable();
        } else {
          control.disable();
        }
      }
    });
    if (this.isBrowser) {
      effect(() => {
        const user = this.login.applicationUser();
        if (user?.email && !untracked(() => this.form.controls.email.value)) {
          this.form.controls.email.setValue(user.email);
        }
      });
    }
  }

  public get language() {
    return this.locale.startsWith('bg') ? 'bg' : 'en';
  }

  public invalid(name: keyof CheckoutComponent['form']['controls']) {
    const control = this.form.controls[name];
    return control.invalid && (control.touched || control.dirty);
  }

  public pay() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (!this.cart.canCheckout() || this.cart.isEmpty()) {
      this.problems.set([$localize`:@@shopCartInvalid:Your cart has changed. Please review it before paying.`]);
      this.cart.refresh();
      return;
    }

    const value = this.form.getRawValue();
    const courier = this.courier();
    const cartRequest = this.cart.request();
    const submittedCart = JSON.stringify(cartRequest);
    const request: OrderRequest = {
      ...cartRequest,
      ...value,
      city: courier ? value.city : null,
      streetAddress: courier ? value.streetAddress : null,
      postalCode: courier ? value.postalCode : null,
      phoneNumber: value.phoneNumber.replace(/\s+/g, ' ').trim(),
      country: 'BG',
      language: this.language
    };
    const requestFingerprint = fingerprint(request);
    const pendingId = this.cart.pendingOrderFor(requestFingerprint);

    this.submitting.set(true);
    this.problems.set([]);
    // Leaving checkout cancels the pending order request, so a late response cannot redirect.
    const target$ = pendingId ? this.resumeOrder(pendingId, request, requestFingerprint) : this.placeOrder(request, requestFingerprint);
    target$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: target => {
        if (JSON.stringify(this.cart.request()) !== submittedCart) {
          // The cart changed while the order was being created; the order no longer matches it.
          this.submitting.set(false);
          this.problems.set([$localize`:@@shopCartInvalid:Your cart has changed. Please review it before paying.`]);
          this.cart.refresh();
          return;
        }
        // The cart is kept until the order is paid, so backing out of the payment does not lose it.
        if ('checkoutUrl' in target) {
          this.document.location.assign(target.checkoutUrl);
        } else {
          this.submitting.set(false);
          this.router.navigate(['/shop/order', target.orderId]);
        }
      },
      error: error => {
        this.submitting.set(false);
        const problems = orderProblems(error);
        if (problems.length) {
          this.problems.set(problems);
        } else if (error.status === 503) {
          this.problems.set([$localize`:@@shopPaymentsUnavailable:Payments are temporarily unavailable. Please try again in a few minutes.`]);
        } else if (error.status === 429) {
          this.problems.set([$localize`:@@shopTooManyAttempts:Too many attempts. Please wait a minute and try again.`]);
        } else {
          this.problems.set([$localize`:@@shopOrderFailed:The order could not be placed. Please try again.`]);
        }
        this.cart.refresh();
      }
    });
  }

  private placeOrder(request: OrderRequest, requestFingerprint: string): Observable<CheckoutTarget> {
    return this.shopApi.createOrder(request).pipe(
      tap(created => this.cart.setPendingOrder(created.orderId, requestFingerprint)),
      map(created => ({ checkoutUrl: created.checkoutUrl }))
    );
  }

  /**
   * Continues the order already placed with this same cart and details instead of placing a second one, which would
   * hold the stock twice. Places a new order only when the earlier one can no longer be paid.
   */
  private resumeOrder(orderId: string, request: OrderRequest, requestFingerprint: string): Observable<CheckoutTarget> {
    const placeAgain = () => {
      this.cart.forgetPendingOrder();
      return this.placeOrder(request, requestFingerprint);
    };
    return this.shopApi.getOrder(orderId).pipe(
      switchMap(order => {
        if (order.checkoutUrl) {
          return of({ checkoutUrl: order.checkoutUrl });
        }
        if (order.canRetryPayment) {
          return this.shopApi.retryPayment(orderId).pipe(map(created => ({ checkoutUrl: created.checkoutUrl })));
        }
        if (order.status === OrderStatus.AwaitingPayment || PAID_STATUSES.includes(order.status)) {
          // Paid already, or a payment is still being confirmed: the order page shows which, and empties the cart once paid.
          return of({ orderId });
        }
        return placeAgain();
      }),
      catchError(error => error?.status === 404 ? placeAgain() : throwError(() => error))
    );
  }
}
