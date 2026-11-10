import { Component, DOCUMENT, DestroyRef, LOCALE_ID, PLATFORM_ID, computed, effect, inject, signal, untracked } from '@angular/core';
import { CurrencyPipe, isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterLink } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IGX_SELECT_DIRECTIVES } from '@infragistics/igniteui-angular/select';
import { IGX_INPUT_GROUP_DIRECTIVES } from '@infragistics/igniteui-angular/input-group';
import { IgxButtonDirective, IgxDividerComponent, IgxIconButtonDirective, IgxRippleDirective } from '@infragistics/igniteui-angular/directives';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
import { IgxCheckboxComponent } from '@infragistics/igniteui-angular/checkbox';
import { IgxRadioComponent, IgxRadioGroupDirective } from '@infragistics/igniteui-angular/radio';
import { IgxCircularProgressBarComponent } from '@infragistics/igniteui-angular/progressbar';
import { ApiShopService, orderProblems } from '../../../services/bellumgens-api.shop.service';
import { CartService, fingerprint } from '../../../services/cart.service';
import { LoginService } from '../../../services/login.service';
import { EMAIL_REGEX } from '../../../models/misc';
import {
  DELIVERY_METHOD_NAMES, DeliveryMethod, OrderRequest, OrderStatus, PAYMENT_METHOD_NAMES, POSTAL_CODE_PATTERN, PaymentMethod, SavedAddress
} from '../../../models/shop';

/** The form fields a saved address fills in. */
const ADDRESS_FIELDS = ['firstName', 'lastName', 'phoneNumber', 'city', 'streetAddress', 'postalCode'] as const;
type AddressFields = Record<typeof ADDRESS_FIELDS[number], string>;

const normalize = (text: string | null | undefined) => (text ?? '').replace(/\s+/g, ' ').trim().toLowerCase();
const sameText = (a: string | null | undefined, b: string | null | undefined) => normalize(a) === normalize(b);

/** Whether the form holds exactly this saved address, the way the server compares them. */
const holdsAddress = (fields: AddressFields, address: SavedAddress) =>
  ADDRESS_FIELDS.every(field => sameText(fields[field], address[field]));

/** Where to send the customer once the order is ready: the provider's checkout, or the order page. */
type CheckoutTarget = { checkoutUrl: string } | { orderId: string };

/** Orders that need no further payment: paid online, or placed with cash on delivery. */
const SETTLED_STATUSES = [OrderStatus.Paid, OrderStatus.Shipped, OrderStatus.Delivered, OrderStatus.Confirmed];

@Component({
  selector: 'bg-checkout',
  imports: [
    CurrencyPipe,
    RouterLink,
    ReactiveFormsModule,
    IGX_INPUT_GROUP_DIRECTIVES,
    IGX_SELECT_DIRECTIVES,
    IgxButtonDirective,
    IgxIconButtonDirective,
    IgxRippleDirective,
    IgxDividerComponent,
    IgxIconComponent,
    IgxCheckboxComponent,
    IgxRadioComponent,
    IgxRadioGroupDirective,
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
  public paymentNames = PAYMENT_METHOD_NAMES;
  public paymentMethods = [PaymentMethod.Revolut, PaymentMethod.CashOnDelivery];
  public submitting = signal(false);
  public problems = signal<string[]>([]);
  /** Only courier delivery needs an address; an order picked up at an event has none. */
  public courier = computed(() => this.cart.deliveryMethod() === DeliveryMethod.Courier);

  public form = this.fb.group({
    /** Cash on delivery (наложен платеж) is collected by the courier, so it is only offered for courier delivery. */
    paymentMethod: [PaymentMethod.Revolut],
    firstName: ['', [Validators.required, Validators.maxLength(100)]],
    lastName: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.pattern(EMAIL_REGEX)]],
    phoneNumber: ['+359 ', [Validators.required, Validators.pattern(/^\+?(?=(?:\D*\d){12})[0-9 ()-]{12,20}$/)]],
    city: ['', [Validators.required, Validators.maxLength(100)]],
    streetAddress: ['', [Validators.required, Validators.maxLength(200)]],
    // Required: several Bulgarian towns share a name, and the postal code tells the courier which one.
    postalCode: ['', [Validators.required, Validators.pattern(POSTAL_CODE_PATTERN)]],
    customerNote: ['', [Validators.maxLength(1000)]],
    acceptedTerms: [false, [Validators.requiredTrue]]
  });

  private paymentMethod = toSignal(this.form.controls.paymentMethod.valueChanges, { initialValue: this.form.controls.paymentMethod.value });
  /** The order is paid to the courier; placing it needs no online payment. */
  public cashOnDelivery = computed(() => this.courier() && this.paymentMethod() === PaymentMethod.CashOnDelivery);

  /** True once a signed-in customer is known; only they have an address book. */
  public signedIn = signal(false);
  /** The signed-in customer's saved addresses, the most recently used first. */
  public addresses = signal<SavedAddress[]>([]);
  /** The saved address the form was filled from; empty while the customer types a new one. */
  public addressChoice = new FormControl('', { nonNullable: true });
  /** Ask to keep a newly typed address in the customer's account. Kept out of the order form and its fingerprint. */
  public saveAddress = new FormControl(false, { nonNullable: true });
  private formValue = toSignal(this.form.valueChanges, { initialValue: this.form.getRawValue() });
  /** The form holds one of the saved addresses, as picked or typed in again. */
  public savedAddressInForm = computed(() => {
    this.formValue();
    const fields = this.form.getRawValue();
    return this.addresses().find(address => holdsAddress(fields, address)) ?? null;
  });

  constructor() {
    // Disabled controls are not validated, so the address is only required while it is shown.
    effect(() => {
      const courier = this.courier();
      if (!courier) {
        this.form.controls.paymentMethod.setValue(PaymentMethod.Revolut);
      }
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
      effect(() => {
        const userId = this.login.applicationUser()?.id ?? null;
        untracked(() => this.loadAddresses(userId));
      });
    }
    this.addressChoice.valueChanges.pipe(takeUntilDestroyed()).subscribe(id => this.fillAddress(id));
    // Once the customer edits a picked address it is a new one, so the picker no longer names the saved one.
    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      const chosen = this.addresses().find(address => address.id === this.addressChoice.value);
      if (chosen && !holdsAddress(this.form.getRawValue(), chosen)) {
        this.addressChoice.setValue('', { emitEvent: false });
      }
    });
  }

  public postalCodeError() {
    return this.form.controls.postalCode.hasError('required')
      ? $localize`:@@shopPostalCodeRequired:Postal code is required`
      : $localize`:@@shopPostalCodeFormat:A Bulgarian postal code has 4 digits`;
  }

  /** "Ivan Petrov, bul. Vitosha 1, 1000 Sofia" */
  public addressLabel(address: SavedAddress) {
    const place = [address.postalCode, address.city].filter(Boolean).join(' ');
    return [`${address.firstName} ${address.lastName}`.trim(), address.streetAddress, place].filter(Boolean).join(', ');
  }

  public removeAddress(id: string) {
    this.shopApi.deleteAddress(id).subscribe({
      next: () => {
        this.addresses.update(addresses => addresses.filter(address => address.id !== id));
        if (this.addressChoice.value === id) {
          this.addressChoice.setValue('', { emitEvent: false });
        }
      },
      error: () => this.problems.set([$localize`:@@shopAddressRemoveFailed:The address could not be removed. Please try again.`])
    });
  }

  private loadAddresses(userId: string | null) {
    this.signedIn.set(!!userId);
    this.addresses.set([]);
    if (!userId) {
      return;
    }
    this.shopApi.getAddresses().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: addresses => {
        this.addresses.set(addresses);
        // Offer the most recently used address, unless the customer already started typing one.
        const { city, streetAddress, postalCode } = this.form.getRawValue();
        if (addresses.length && !this.addressChoice.value && !city && !streetAddress && !postalCode) {
          this.addressChoice.setValue(addresses[0].id);
        }
      },
      // Without the address book the customer types the address, as a guest would.
      error: () => this.addresses.set([])
    });
  }

  /** Fills the form from a saved address, or clears the address for a new one. Contact names stay as typed then. */
  private fillAddress(id: string) {
    const address = this.addresses().find(saved => saved.id === id);
    if (address) {
      this.form.patchValue({
        firstName: address.firstName,
        lastName: address.lastName,
        phoneNumber: address.phoneNumber,
        city: address.city,
        streetAddress: address.streetAddress,
        postalCode: address.postalCode
      });
      this.saveAddress.setValue(false);
    } else {
      this.form.patchValue({ city: '', streetAddress: '', postalCode: '' });
      this.form.controls.city.markAsUntouched();
      this.form.controls.streetAddress.markAsUntouched();
      this.form.controls.postalCode.markAsUntouched();
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
      paymentMethod: this.cashOnDelivery() ? PaymentMethod.CashOnDelivery : PaymentMethod.Revolut,
      city: courier ? value.city : null,
      streetAddress: courier ? value.streetAddress : null,
      postalCode: courier ? value.postalCode : null,
      phoneNumber: value.phoneNumber.replace(/\s+/g, ' ').trim(),
      country: 'BG',
      language: this.language
    };
    const requestFingerprint = fingerprint(request);
    const pendingId = this.cart.pendingOrderFor(requestFingerprint);
    // An unpaid order placed from this cart with other details (e.g. another payment method) is replaced by the new
    // one, which releases its stock instead of holding it twice until it expires. A saved address that is used again
    // is sent to be saved too, which only marks it as the most recently used.
    const replacing: OrderRequest = {
      ...request,
      replacesOrderId: this.cart.pendingOrder()?.id ?? null,
      saveAddress: courier && this.signedIn() && (this.saveAddress.value || !!this.savedAddressInForm())
    };

    this.submitting.set(true);
    this.problems.set([]);
    // Leaving checkout cancels the pending order request, so a late response cannot redirect.
    const target$ = pendingId ? this.resumeOrder(pendingId, request, requestFingerprint) : this.placeOrder(replacing, requestFingerprint);
    target$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: target => {
        if (!('checkoutUrl' in target)) {
          // Nothing left to pay online (a cash on delivery order, or one paid already): show the order, which
          // empties the cart. The order exists whether or not the cart changed meanwhile.
          this.submitting.set(false);
          this.router.navigate(['/shop/order', target.orderId]);
          return;
        }
        if (JSON.stringify(this.cart.request()) !== submittedCart) {
          // The cart changed while the order was being created; the order no longer matches it.
          this.submitting.set(false);
          this.problems.set([$localize`:@@shopCartInvalid:Your cart has changed. Please review it before paying.`]);
          this.cart.refresh();
          return;
        }
        // The cart is kept until the order is paid, so backing out of the payment does not lose it.
        this.document.location.assign(target.checkoutUrl);
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

  /**
   * Places the order and remembers it as the cart's pending order. A cash on delivery order comes back without a
   * checkout: the order page it leads to sees it confirmed and empties the cart.
   */
  private placeOrder(request: OrderRequest, requestFingerprint: string): Observable<CheckoutTarget> {
    return this.shopApi.createOrder(request).pipe(
      tap(created => this.cart.setPendingOrder(created.orderId, requestFingerprint)),
      map(created => created.checkoutUrl ? { checkoutUrl: created.checkoutUrl } : { orderId: created.orderId })
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
          return this.shopApi.retryPayment(orderId).pipe(
            map(created => created.checkoutUrl ? { checkoutUrl: created.checkoutUrl } : { orderId })
          );
        }
        if (order.status === OrderStatus.AwaitingPayment || SETTLED_STATUSES.includes(order.status)) {
          // Paid or placed already, or a payment is still being confirmed: the order page shows which, and empties
          // the cart once nothing is left to pay.
          return of({ orderId });
        }
        return placeAgain();
      }),
      catchError(error => error?.status === 404 ? placeAgain() : throwError(() => error))
    );
  }
}
