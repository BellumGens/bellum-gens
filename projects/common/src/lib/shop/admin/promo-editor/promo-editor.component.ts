import { ChangeDetectionStrategy, Component, ViewChild, inject, signal } from '@angular/core';
import { DatePipe, PercentPipe } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IGX_INPUT_GROUP_DIRECTIVES } from '@infragistics/igniteui-angular/input-group';
import { IGX_SELECT_DIRECTIVES } from '@infragistics/igniteui-angular/select';
import { IGX_DATE_PICKER_DIRECTIVES } from '@infragistics/igniteui-angular/date-picker';
import { IgxCheckboxComponent } from '@infragistics/igniteui-angular/checkbox';
import { IgxButtonDirective, IgxIconButtonDirective, IgxRippleDirective } from '@infragistics/igniteui-angular/directives';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
import { IgxChipComponent } from '@infragistics/igniteui-angular/chips';
import { ApiShopService } from '../../../../services/bellumgens-api.shop.service';
import { ConfirmComponent } from '../../../confirm/confirm.component';
import { BRAND_NAMES, Brand, Promo } from '../../../../models/shop';

const ANY_BRAND = -1;

/** Admin editor for promo codes: discount, validity window, usage limit and brand restriction. */
@Component({
  selector: 'bg-promo-editor',
  imports: [
    DatePipe,
    PercentPipe,
    ReactiveFormsModule,
    IGX_INPUT_GROUP_DIRECTIVES,
    IGX_SELECT_DIRECTIVES,
    IGX_DATE_PICKER_DIRECTIVES,
    IgxCheckboxComponent,
    IgxButtonDirective,
    IgxIconButtonDirective,
    IgxRippleDirective,
    IgxIconComponent,
    IgxChipComponent,
    ConfirmComponent
  ],
  templateUrl: './promo-editor.component.html',
  styleUrl: './promo-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PromoEditorComponent {
  private shopApi = inject(ApiShopService);
  private fb = inject(NonNullableFormBuilder);

  @ViewChild(ConfirmComponent, { static: true })
  public confirm: ConfirmComponent;

  public promos = signal<Promo[]>([]);
  public editing = signal<Promo | null>(null);
  public saving = signal(false);

  public brands = [ANY_BRAND, Brand.BellumGens, Brand.EBLeague, Brand.BGEStaraZagora];
  public brandNames = BRAND_NAMES;
  public anyBrand = ANY_BRAND;

  public form = this.fb.group({
    code: ['', [Validators.required, Validators.maxLength(50), Validators.pattern(/^[A-Za-z0-9_-]+$/)]],
    discountPercent: [10, [Validators.required, Validators.min(0), Validators.max(100)]],
    expiration: [null as Date | null],
    active: [true],
    usageLimit: [null as number | null, [Validators.min(1)]],
    minimumOrderTotal: [null as number | null, [Validators.min(0)]],
    brand: [ANY_BRAND]
  });

  constructor() {
    this.load();
  }

  public load() {
    this.shopApi.getPromos().subscribe(promos => this.promos.set(promos));
  }

  public newPromo() {
    this.editing.set(null);
    this.form.reset({ code: '', discountPercent: 10, expiration: null, active: true, usageLimit: null, minimumOrderTotal: null, brand: ANY_BRAND });
    this.form.controls.code.enable();
  }

  public edit(promo: Promo) {
    this.editing.set(promo);
    this.form.reset({
      code: promo.code,
      discountPercent: Math.round(promo.discount * 10000) / 100,
      expiration: promo.expiration ? new Date(promo.expiration) : null,
      active: promo.active,
      usageLimit: promo.usageLimit ?? null,
      minimumOrderTotal: promo.minimumOrderTotal ?? null,
      brand: promo.brand ?? ANY_BRAND
    });
    this.form.controls.code.disable();
  }

  public save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    const editing = this.editing();
    const promo: Promo = {
      code: raw.code.trim().toUpperCase(),
      discount: Math.round(Number(raw.discountPercent) * 100) / 10000,
      expiration: raw.expiration ? new Date(raw.expiration).toISOString() : null,
      active: raw.active,
      usageLimit: raw.usageLimit === null || `${raw.usageLimit}` === '' ? null : Number(raw.usageLimit),
      minimumOrderTotal: raw.minimumOrderTotal === null || `${raw.minimumOrderTotal}` === '' ? null : Number(raw.minimumOrderTotal),
      brand: raw.brand === ANY_BRAND ? null : raw.brand,
      timesUsed: editing?.timesUsed ?? 0
    };
    this.saving.set(true);
    this.shopApi.savePromo(promo, editing === null).subscribe({
      next: saved => {
        this.saving.set(false);
        this.load();
        this.edit(saved);
      },
      error: () => this.saving.set(false)
    });
  }

  public askDelete(promo: Promo) {
    this.confirm.open(promo.code);
  }

  public delete(code: string) {
    this.shopApi.deletePromo(code).subscribe(() => {
      if (this.editing()?.code === code) {
        this.newPromo();
      }
      this.load();
    });
  }
}
