import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'bg-products',
  imports: [],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsComponent { }
