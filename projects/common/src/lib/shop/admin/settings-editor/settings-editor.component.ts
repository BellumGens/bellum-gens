import { Component, ElementRef, computed, inject, signal, viewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IGX_INPUT_GROUP_DIRECTIVES } from '@infragistics/igniteui-angular/input-group';
import { IgxButtonDirective, IgxRippleDirective } from '@infragistics/igniteui-angular/directives';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
import { ApiShopService } from 'bellum-gens-common/services';
import { ShopSettings } from 'bellum-gens-common/models';

/**
 * Client-side copy of the ranges the server validates (the [Range] attributes on ShopSettings in the API), so the
 * admin gets an inline hint instead of a round trip. The server stays authoritative: a value it rejects is reported
 * through the usual error message and the form keeps the admin's input.
 */
export const SHOP_SETTINGS_LIMITS = {
  maxShippingCost: 1000,
  maxFreeShippingThreshold: 100000,
  maxQuantityPerLine: 100
} as const;

/** A non-negative amount with at most two decimals (whole cents). */
const MONEY_PATTERN = /^\d+(\.\d{1,2})?$/;

/** Admin editor for the shop pricing rules: courier fee, free shipping threshold and per-line quantity limit. */
@Component({
  selector: 'bg-shop-settings-editor',
  imports: [
    DatePipe,
    ReactiveFormsModule,
    IGX_INPUT_GROUP_DIRECTIVES,
    IgxButtonDirective,
    IgxRippleDirective,
    IgxIconComponent
  ],
  templateUrl: './settings-editor.component.html',
  styleUrl: './settings-editor.component.scss'
})
export class ShopSettingsEditorComponent {
  private shopApi = inject(ApiShopService);
  private fb = inject(NonNullableFormBuilder);
  private formElement = viewChild<ElementRef<HTMLFormElement>>('settingsForm');

  public settings = signal<ShopSettings | null>(null);
  public loading = signal(false);
  public loadFailed = signal(false);
  public saving = signal(false);
  public readonly limits = SHOP_SETTINGS_LIMITS;
  /** The currency the shop charges in, as the storefront settings report it. */
  public currency = computed(() => this.shopApi.settings()?.currency ?? null);

  public form = this.fb.group({
    shippingCost: [0, [Validators.required, Validators.min(0), Validators.max(SHOP_SETTINGS_LIMITS.maxShippingCost), Validators.pattern(MONEY_PATTERN)]],
    freeShippingThreshold: [0, [Validators.required, Validators.min(0), Validators.max(SHOP_SETTINGS_LIMITS.maxFreeShippingThreshold), Validators.pattern(MONEY_PATTERN)]],
    maxQuantityPerLine: [1, [Validators.required, Validators.min(1), Validators.max(SHOP_SETTINGS_LIMITS.maxQuantityPerLine), Validators.pattern(/^\d+$/)]]
  });

  constructor() {
    this.load();
  }

  public load() {
    this.loading.set(true);
    this.loadFailed.set(false);
    // The inputs stay locked until the stored values arrive, so nothing typed meanwhile is overwritten.
    this.form.disable();
    this.shopApi.getAdminSettings().subscribe({
      next: settings => {
        this.loading.set(false);
        this.apply(settings);
      },
      error: () => {
        this.loading.set(false);
        this.loadFailed.set(true);
      }
    });
  }

  public save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.focusFirstInvalid();
      return;
    }
    const raw = this.form.getRawValue();
    this.saving.set(true);
    // Locked while saving: the response resets the form, which would drop any edit made in the meantime.
    this.form.disable();
    this.shopApi.saveSettings({
      shippingCost: Number(raw.shippingCost),
      freeShippingThreshold: Number(raw.freeShippingThreshold),
      maxQuantityPerLine: Number(raw.maxQuantityPerLine)
    }).subscribe({
      next: saved => {
        this.saving.set(false);
        this.apply(saved);
      },
      error: () => {
        // Keep what the admin entered so they can correct it and try again.
        this.saving.set(false);
        this.form.enable();
      }
    });
  }

  private apply(settings: ShopSettings) {
    this.settings.set(settings);
    this.form.reset({
      shippingCost: settings.shippingCost,
      freeShippingThreshold: settings.freeShippingThreshold,
      maxQuantityPerLine: settings.maxQuantityPerLine
    });
    this.form.enable();
  }

  /** Moves focus to the first field in error, whose hint the screen reader then announces through aria-describedby. */
  private focusFirstInvalid() {
    const invalid = Object.entries(this.form.controls).find(([, control]) => control.invalid)?.[0];
    if (invalid) {
      this.formElement()?.nativeElement.querySelector<HTMLElement>(`[formControlName="${invalid}"]`)?.focus();
    }
  }
}
