import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IGX_INPUT_GROUP_DIRECTIVES } from '@infragistics/igniteui-angular/input-group';
import { IgxButtonDirective, IgxRippleDirective } from '@infragistics/igniteui-angular/directives';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
import { ApiShopService } from 'bellum-gens-common/services';
import { ShopSettings } from 'bellum-gens-common/models';

/** The limits the server accepts (see ShopSettings in the API). */
export const SHOP_SETTINGS_LIMITS = {
  maxShippingCost: 1000,
  maxFreeShippingThreshold: 100000,
  maxQuantityPerLine: 100
} as const;

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

  public settings = signal<ShopSettings | null>(null);
  public saving = signal(false);
  public readonly limits = SHOP_SETTINGS_LIMITS;

  public form = this.fb.group({
    shippingCost: [0, [Validators.required, Validators.min(0), Validators.max(SHOP_SETTINGS_LIMITS.maxShippingCost)]],
    freeShippingThreshold: [0, [Validators.required, Validators.min(0), Validators.max(SHOP_SETTINGS_LIMITS.maxFreeShippingThreshold)]],
    maxQuantityPerLine: [1, [Validators.required, Validators.min(1), Validators.max(SHOP_SETTINGS_LIMITS.maxQuantityPerLine), Validators.pattern(/^\d+$/)]]
  });

  constructor() {
    this.load();
  }

  public load() {
    this.shopApi.getAdminSettings().subscribe(settings => this.apply(settings));
  }

  public save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    this.saving.set(true);
    this.shopApi.saveSettings({
      shippingCost: Number(raw.shippingCost),
      freeShippingThreshold: Number(raw.freeShippingThreshold),
      maxQuantityPerLine: Number(raw.maxQuantityPerLine)
    }).subscribe({
      next: saved => {
        this.saving.set(false);
        this.apply(saved);
      },
      error: () => this.saving.set(false)
    });
  }

  private apply(settings: ShopSettings) {
    this.settings.set(settings);
    this.form.reset({
      shippingCost: settings.shippingCost,
      freeShippingThreshold: settings.freeShippingThreshold,
      maxQuantityPerLine: settings.maxQuantityPerLine
    });
  }
}
