import { ChangeDetectionStrategy, Component, ViewChild, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormArray, FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { IGX_INPUT_GROUP_DIRECTIVES } from '@infragistics/igniteui-angular/input-group';
import { IGX_SELECT_DIRECTIVES } from '@infragistics/igniteui-angular/select';
import { IgxCheckboxComponent } from '@infragistics/igniteui-angular/checkbox';
import { IgxButtonDirective, IgxDividerComponent, IgxIconButtonDirective, IgxRippleDirective } from '@infragistics/igniteui-angular/directives';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
import { IgxChipComponent } from '@infragistics/igniteui-angular/chips';
import { IGX_LIST_DIRECTIVES } from '@infragistics/igniteui-angular/list';
import { ApiShopService } from '../../../../services/bellumgens-api.shop.service';
import { ConfirmComponent } from '../../../confirm/confirm.component';
import {
  BRAND_NAMES,
  Brand,
  JERSEY_CUT_NAMES,
  JERSEY_SIZE_NAMES,
  JerseyCut,
  JerseySize,
  PRODUCT_TYPE_NAMES,
  Product,
  ProductType,
  ProductVariant
} from '../../../../models/shop';

/** Sentinel for "no cut" / "no size" in the selects, since a select item cannot carry null. */
const NONE = -1;
const EMPTY_GUID = '00000000-0000-0000-0000-000000000000';

type VariantForm = FormGroup<{
  id: FormControl<string>;
  name: FormControl<string>;
  cut: FormControl<number>;
  size: FormControl<number>;
  sku: FormControl<string>;
  priceOverride: FormControl<number | null>;
  stockQuantity: FormControl<number | null>;
  active: FormControl<boolean>;
  sortOrder: FormControl<number>;
}>;

/** Admin catalog editor: products, their variants, stock and images. */
@Component({
  selector: 'bg-product-editor',
  imports: [
    CurrencyPipe,
    ReactiveFormsModule,
    IGX_INPUT_GROUP_DIRECTIVES,
    IGX_SELECT_DIRECTIVES,
    IGX_LIST_DIRECTIVES,
    IgxCheckboxComponent,
    IgxButtonDirective,
    IgxIconButtonDirective,
    IgxRippleDirective,
    IgxDividerComponent,
    IgxIconComponent,
    IgxChipComponent,
    ConfirmComponent
  ],
  templateUrl: './product-editor.component.html',
  styleUrl: './product-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductEditorComponent {
  private shopApi = inject(ApiShopService);
  private fb = inject(NonNullableFormBuilder);

  @ViewChild(ConfirmComponent, { static: true })
  public confirm: ConfirmComponent;

  public products = signal<Product[]>([]);
  public loading = signal(true);
  public saving = signal(false);
  public uploading = signal(false);
  public selectedId = signal<string | null>(null);

  public brands = [Brand.BellumGens, Brand.EBLeague, Brand.BGEStaraZagora];
  public brandNames = BRAND_NAMES;
  public types = [ProductType.Jersey, ProductType.Umbrella, ProductType.Pen, ProductType.Pin, ProductType.Bracelet, ProductType.Other];
  public typeNames = PRODUCT_TYPE_NAMES;
  public cuts = [NONE, JerseyCut.Male, JerseyCut.Female];
  public cutNames = JERSEY_CUT_NAMES;
  public sizes = [NONE, JerseySize.XS, JerseySize.S, JerseySize.M, JerseySize.L, JerseySize.XL, JerseySize.XXL, JerseySize.XXXL];
  public sizeNames = JERSEY_SIZE_NAMES;
  public none = NONE;

  public form = this.fb.group({
    id: [''],
    name: ['', [Validators.required, Validators.maxLength(200)]],
    slug: ['', [Validators.maxLength(200)]],
    description: [''],
    type: [ProductType.Other],
    brand: [Brand.BellumGens],
    price: [0, [Validators.required, Validators.min(0)]],
    discountPercentage: [null as number | null, [Validators.min(0), Validators.max(100)]],
    imageUrl: [''],
    galleryUrls: [''],
    stockQuantity: [null as number | null, [Validators.min(0)]],
    active: [true],
    sortOrder: [0],
    variants: this.fb.array<VariantForm>([])
  });

  public isNew = computed(() => this.selectedId() === null);

  constructor() {
    this.load();
  }

  public get variants(): FormArray<VariantForm> {
    return this.form.controls.variants;
  }

  public get hasVariants() {
    return this.variants.length > 0;
  }

  public load() {
    this.loading.set(true);
    this.shopApi.getAdminProducts().subscribe({
      next: products => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  public newProduct() {
    this.selectedId.set(null);
    this.variants.clear();
    this.form.reset({
      id: '',
      name: '',
      slug: '',
      description: '',
      type: ProductType.Other,
      brand: Brand.BellumGens,
      price: 0,
      discountPercentage: null,
      imageUrl: '',
      galleryUrls: '',
      stockQuantity: null,
      active: true,
      sortOrder: this.products().length
    });
  }

  public edit(product: Product) {
    this.selectedId.set(product.id);
    this.variants.clear();
    this.form.reset({
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description ?? '',
      type: product.type,
      brand: product.brand,
      price: product.price,
      discountPercentage: product.discountPercentage ?? null,
      imageUrl: product.imageUrl ?? '',
      galleryUrls: (product.galleryUrls ?? []).join('\n'),
      stockQuantity: product.stockQuantity ?? null,
      active: product.active,
      sortOrder: product.sortOrder
    });
    [...(product.variants ?? [])]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .forEach(variant => this.variants.push(this.variantGroup(variant)));
  }

  public addVariant() {
    this.variants.push(this.variantGroup());
  }

  public removeVariant(index: number) {
    this.variants.removeAt(index);
  }

  /** Creates the usual jersey matrix: male S to XXXL and female XS to XL, skipping combinations that already exist. */
  public generateJerseySizes() {
    const existing = new Set(this.variants.controls.map(v => `${v.controls.cut.value}-${v.controls.size.value}`));
    const add = (cut: JerseyCut, size: JerseySize) => {
      if (!existing.has(`${cut}-${size}`)) {
        this.variants.push(this.variantGroup({ cut, size, name: `${JERSEY_CUT_NAMES[cut]} / ${JERSEY_SIZE_NAMES[size]}` }));
      }
    };
    [JerseySize.S, JerseySize.M, JerseySize.L, JerseySize.XL, JerseySize.XXL, JerseySize.XXXL].forEach(size => add(JerseyCut.Male, size));
    [JerseySize.XS, JerseySize.S, JerseySize.M, JerseySize.L, JerseySize.XL].forEach(size => add(JerseyCut.Female, size));
  }

  public save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.getRawValue();
    const product: Product = {
      id: raw.id,
      name: raw.name.trim(),
      slug: raw.slug.trim(),
      description: raw.description.trim() || null,
      type: raw.type,
      brand: raw.brand,
      price: Number(raw.price),
      discountPercentage: raw.discountPercentage === null || raw.discountPercentage === undefined || `${raw.discountPercentage}` === '' ? null : Number(raw.discountPercentage),
      imageUrl: raw.imageUrl.trim() || null,
      galleryUrls: raw.galleryUrls.split(/\r?\n/).map(u => u.trim()).filter(u => u.length > 0),
      stockQuantity: raw.variants.length > 0 || raw.stockQuantity === null || `${raw.stockQuantity}` === '' ? null : Number(raw.stockQuantity),
      active: raw.active,
      sortOrder: Number(raw.sortOrder) || 0,
      variants: raw.variants.map((v, index) => ({
        id: v.id || EMPTY_GUID,
        name: v.name.trim() || this.variantName(v.cut, v.size),
        cut: v.cut === NONE ? null : v.cut,
        size: v.size === NONE ? null : v.size,
        sku: v.sku.trim() || null,
        priceOverride: v.priceOverride === null || `${v.priceOverride}` === '' ? null : Number(v.priceOverride),
        stockQuantity: v.stockQuantity === null || `${v.stockQuantity}` === '' ? null : Number(v.stockQuantity),
        active: v.active,
        sortOrder: index
      }))
    };

    this.saving.set(true);
    this.shopApi.saveProduct(product).subscribe({
      next: saved => {
        this.saving.set(false);
        this.load();
        this.edit(saved);
      },
      error: () => this.saving.set(false)
    });
  }

  public askDelete() {
    if (this.selectedId()) {
      this.confirm.open(this.selectedId());
    }
  }

  public delete(productId: string) {
    this.shopApi.deleteProduct(productId).subscribe(() => {
      this.newProduct();
      this.load();
    });
  }

  public upload(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    const productId = this.selectedId();
    if (!file || !productId) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.uploading.set(true);
      this.shopApi.uploadProductImage(productId, reader.result as string).subscribe({
        next: result => {
          this.form.controls.imageUrl.setValue(result.url);
          this.uploading.set(false);
          this.load();
        },
        error: () => this.uploading.set(false)
      });
    };
    reader.readAsDataURL(file);
    input.value = '';
  }

  public variantName(cut: number, size: number) {
    const parts: string[] = [];
    if (cut !== NONE) {
      parts.push(JERSEY_CUT_NAMES[cut as JerseyCut]);
    }
    if (size !== NONE) {
      parts.push(JERSEY_SIZE_NAMES[size as JerseySize]);
    }
    return parts.length ? parts.join(' / ') : $localize`:@@shopVariantDefault:Default`;
  }

  private variantGroup(variant?: Partial<ProductVariant>): VariantForm {
    return this.fb.group({
      id: [variant?.id ?? ''],
      name: [variant?.name ?? ''],
      cut: [variant?.cut ?? NONE],
      size: [variant?.size ?? NONE],
      sku: [variant?.sku ?? ''],
      priceOverride: [variant?.priceOverride ?? null as number | null],
      stockQuantity: [variant?.stockQuantity ?? null as number | null],
      active: [variant?.active ?? true],
      sortOrder: [variant?.sortOrder ?? this.variants.length]
    }) as VariantForm;
  }
}
