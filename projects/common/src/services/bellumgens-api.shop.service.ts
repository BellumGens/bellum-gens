import { Injectable, Signal, inject, signal, untracked } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Order, Product, ProductOrderDetails, Promo } from '../models/order';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CommunicationService } from './communication.service';

@Injectable({
  providedIn: 'root'
})
export class ApiShopService {
  private http = inject(HttpClient);
  private commService = inject(CommunicationService);

  private _apiEndpoint = environment.apiEndpoint;
  private _products = signal<Product []>(null);
  private _productsReadonly = this._products.asReadonly();
  private _productsRequested = false;
  private _cart = signal<ProductOrderDetails []>([]);

  public readonly cart = this._cart.asReadonly();

  public submitOrder(order: Order) {
    return this.http.post<Order>(`${this._apiEndpoint}/shop/order`, order);
  }

  public get products(): Signal<Product []> {
    untracked(() => {
      if (!this._products() && !this._productsRequested) {
        this._productsRequested = true;
        this.http.get<Product []>(`${this._apiEndpoint}/shop/products`).subscribe({
          next: (products) => this._products.set(products),
          error: (error) => {
            this._productsRequested = false;
            this.commService.emitError(error.message);
          }
        });
      }
    });
    return this._productsReadonly;
  }

  public deleteOrder(orderId: string) {
    return this.http.delete<Order>(`${this._apiEndpoint}/shop/order?orderId=${orderId}`, { withCredentials: true }).pipe(
      map(response => {
        this.commService.emitSuccess('Order deleted successfully!');
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.message);
        return throwError(() => error);
      })
    );
  }

  public checkForPromo(code: string) {
    return this.http.get<Promo>(`${this._apiEndpoint}/shop/promo?code=${code}`);
  }

  public addToCart(cartItem: ProductOrderDetails) {
    this._cart.update(cart => [...cart, cartItem]);
    this.commService.emitSuccess(`${cartItem.product.productName} added to cart!`);
  }

  public getOrders() {
    return this.http.get<Order []>(`${this._apiEndpoint}/shop/orders`, { withCredentials: true });
  }

  public confirmOrder(order: Order) {
    return this.http.put(`${this._apiEndpoint}/shop/edit?orderId=${order.id}`, order, { withCredentials: true }).pipe(
      map(response => {
        this.commService.emitSuccess('Order confirmed successfully!');
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.message);
        return throwError(() => error);
      })
    );
  }
}
