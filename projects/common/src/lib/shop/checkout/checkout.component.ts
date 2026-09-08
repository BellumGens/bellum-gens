import { ChangeDetectionStrategy, Component, DOCUMENT, LOCALE_ID, PLATFORM_ID, inject, signal } from '@angular/core';
import { CurrencyPipe, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IGX_INPUT_GROUP_DIRECTIVES } from '@infragistics/igniteui-angular/input-group';
import { IgxButtonDirective, IgxDividerComponent, IgxRippleDirective } from '@infragistics/igniteui-angular/directives';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
import { IgxCheckboxComponent } from '@infragistics/igniteui-angular/checkbox';
import { IgxCircularProgressBarComponent } from '@infragistics/igniteui-angular/progressbar';
import { ApiShopService, orderProblems } from '../../../services/bellumgens-api.shop.service';
import { CartService } from '../../../services/cart.service';
import { LoginService } from '../../../services/login.service';
import { EMAIL_REGEX } from '../../../models/misc';
import { DELIVERY_METHOD_NAMES, OrderRequest } from '../../../models/shop';

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
  styleUrl: './checkout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckoutComponent {
  public cart = inject(CartService);
  private fb = inject(NonNullableFormBuilder);
  private shopApi = inject(ApiShopService);
  private login = inject(LoginService);
  private locale = inject(LOCALE_ID);
  private document = inject(DOCUMENT);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  public deliveryNames = DELIVERY_METHOD_NAMES;
  public submitting = signal(false);
  public problems = signal<string[]>([]);

  public form = this.fb.group({
    firstName: ['', [Validators.required, Validators.maxLength(100)]],
    lastName: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.pattern(EMAIL_REGEX)]],
    phoneNumber: ['+359 ', [Validators.required, Validators.pattern(/^\+?[0-9 ()-]{6,20}$/)]],
    city: ['', [Validators.required, Validators.maxLength(100)]],
    streetAddress: ['', [Validators.required, Validators.maxLength(200)]],
    postalCode: ['', [Validators.maxLength(10)]],
    customerNote: ['', [Validators.maxLength(1000)]],
    acceptedTerms: [false, [Validators.requiredTrue]]
  });

  constructor() {
    if (this.isBrowser) {
      this.login.applicationUser.subscribe(user => {
        if (user?.email && !this.form.controls.email.value) {
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
    const quote = this.cart.quote();
    if (!quote?.isValid || this.cart.isEmpty()) {
      this.problems.set([$localize`:@@shopCartInvalid:Your cart has changed. Please review it before paying.`]);
      this.cart.refresh();
      return;
    }

    const value = this.form.getRawValue();
    const request: OrderRequest = {
      ...this.cart.request(),
      ...value,
      phoneNumber: value.phoneNumber.replace(/\s+/g, ' ').trim(),
      country: 'BG',
      language: this.language
    };

    this.submitting.set(true);
    this.problems.set([]);
    this.shopApi.createOrder(request).subscribe({
      next: created => {
        this.cart.clear();
        this.document.location.assign(created.checkoutUrl);
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
}
