import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, shareReplay, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { CommunicationService } from './communication.service';
import {
  Brand,
  OrderCreated,
  OrderRequest,
  OrderStatus,
  OrderStatusUpdate,
  OrderStatusView,
  Product,
  ProductType,
  Promo,
  PromoView,
  Quote,
  QuoteRequest,
  ShopOrder,
  WebhookRegistration
} from '../models/shop';

@Injectable({
  providedIn: 'root'
})
export class ApiShopService {
  private http = inject(HttpClient);
  private commService = inject(CommunicationService);

  private _apiEndpoint = environment.apiEndpoint;
  private _products$: Observable<Product[]> | null = null;

  // Storefront

  /** Active products. Cached for the lifetime of the app; call `refreshProducts()` to drop the cache. */
  public get products(): Observable<Product[]> {
    if (!this._products$) {
      this._products$ = this.http.get<Product[]>(`${this._apiEndpoint}/shop/products`).pipe(
        catchError(error => {
          this._products$ = null;
          this.commService.emitError(error.message);
          return of([] as Product[]);
        }),
        shareReplay({ bufferSize: 1, refCount: false })
      );
    }
    return this._products$;
  }

  public refreshProducts() {
    this._products$ = null;
  }

  public getProducts(brand?: Brand, type?: ProductType) {
    let params = new HttpParams();
    if (brand !== undefined && brand !== null) {
      params = params.set('brand', brand);
    }
    if (type !== undefined && type !== null) {
      params = params.set('type', type);
    }
    return this.http.get<Product[]>(`${this._apiEndpoint}/shop/products`, { params });
  }

  public getProduct(slug: string) {
    return this.http.get<Product>(`${this._apiEndpoint}/shop/products/${encodeURIComponent(slug)}`);
  }

  public checkPromo(code: string) {
    return this.http.get<PromoView>(`${this._apiEndpoint}/shop/promo`, { params: { code } });
  }

  public quote(request: QuoteRequest) {
    return this.http.post<Quote>(`${this._apiEndpoint}/shop/quote`, request);
  }

  public createOrder(request: OrderRequest) {
    return this.http.post<OrderCreated>(`${this._apiEndpoint}/shop/orders`, request, { withCredentials: true });
  }

  public getOrder(orderId: string) {
    return this.http.get<OrderStatusView>(`${this._apiEndpoint}/shop/orders/${orderId}`);
  }

  public retryPayment(orderId: string) {
    return this.http.post<OrderCreated>(`${this._apiEndpoint}/shop/orders/${orderId}/retry-payment`, null);
  }

  public getMyOrders() {
    return this.http.get<OrderStatusView[]>(`${this._apiEndpoint}/shop/orders/mine`, { withCredentials: true });
  }

  // Administration

  public getAdminProducts() {
    return this.http.get<Product[]>(`${this._apiEndpoint}/shopadmin/products`, { withCredentials: true });
  }

  public saveProduct(product: Product) {
    const request = product.id
      ? this.http.put<Product>(`${this._apiEndpoint}/shopadmin/products/${product.id}`, product, { withCredentials: true })
      : this.http.post<Product>(`${this._apiEndpoint}/shopadmin/products`, product, { withCredentials: true });
    return request.pipe(
      tap(() => {
        this.refreshProducts();
        this.commService.emitSuccess($localize`:@@shopProductSaved:Product saved!`);
      }),
      catchError(error => this.fail<Product>(error))
    );
  }

  public deleteProduct(productId: string) {
    return this.http.delete<{ id: string; deactivated: boolean }>(`${this._apiEndpoint}/shopadmin/products/${productId}`, { withCredentials: true }).pipe(
      tap(result => {
        this.refreshProducts();
        this.commService.emitSuccess(result.deactivated
          ? $localize`:@@shopProductDeactivated:The product has orders, so it was deactivated instead of deleted.`
          : $localize`:@@shopProductDeleted:Product deleted!`);
      }),
      catchError(error => this.fail<{ id: string; deactivated: boolean }>(error))
    );
  }

  public uploadProductImage(productId: string, image: string) {
    return this.http.post<{ url: string }>(`${this._apiEndpoint}/shopadmin/products/${productId}/image`, { image }, { withCredentials: true }).pipe(
      tap(() => this.refreshProducts()),
      catchError(error => this.fail<{ url: string }>(error))
    );
  }

  public getAdminOrders(status?: OrderStatus) {
    let params = new HttpParams();
    if (status !== undefined && status !== null) {
      params = params.set('status', status);
    }
    return this.http.get<ShopOrder[]>(`${this._apiEndpoint}/shopadmin/orders`, { params, withCredentials: true });
  }

  public updateOrderStatus(orderId: string, update: OrderStatusUpdate) {
    return this.http.put<ShopOrder>(`${this._apiEndpoint}/shopadmin/orders/${orderId}/status`, update, { withCredentials: true }).pipe(
      tap(() => this.commService.emitSuccess($localize`:@@shopOrderUpdated:Order updated!`)),
      catchError(error => this.fail<ShopOrder>(error))
    );
  }

  public refundOrder(orderId: string) {
    return this.http.post<ShopOrder>(`${this._apiEndpoint}/shopadmin/orders/${orderId}/refund`, null, { withCredentials: true }).pipe(
      tap(() => this.commService.emitSuccess($localize`:@@shopOrderRefunded:Refund sent to the payment provider.`)),
      catchError(error => this.fail<ShopOrder>(error))
    );
  }

  public get ordersExportUrl() {
    return `${this._apiEndpoint}/shopadmin/orders/export.csv`;
  }

  public getPromos() {
    return this.http.get<Promo[]>(`${this._apiEndpoint}/shopadmin/promos`, { withCredentials: true });
  }

  public savePromo(promo: Promo, isNew: boolean) {
    const request = isNew
      ? this.http.post<Promo>(`${this._apiEndpoint}/shopadmin/promos`, promo, { withCredentials: true })
      : this.http.put<Promo>(`${this._apiEndpoint}/shopadmin/promos/${encodeURIComponent(promo.code)}`, promo, { withCredentials: true });
    return request.pipe(
      tap(() => this.commService.emitSuccess($localize`:@@shopPromoSaved:Promo code saved!`)),
      catchError(error => this.fail<Promo>(error))
    );
  }

  public deletePromo(code: string) {
    return this.http.delete<{ code: string; deactivated: boolean }>(`${this._apiEndpoint}/shopadmin/promos/${encodeURIComponent(code)}`, { withCredentials: true }).pipe(
      tap(result => this.commService.emitSuccess(result.deactivated
        ? $localize`:@@shopPromoDeactivated:The code was used by orders, so it was deactivated instead of deleted.`
        : $localize`:@@shopPromoDeleted:Promo code deleted!`)),
      catchError(error => this.fail<{ code: string; deactivated: boolean }>(error))
    );
  }

  public registerWebhook(url: string) {
    return this.http.post<WebhookRegistration>(`${this._apiEndpoint}/shopadmin/payments/webhook`, { url }, { withCredentials: true }).pipe(
      catchError(error => this.fail<WebhookRegistration>(error))
    );
  }

  private fail<T>(error: { error?: unknown; message: string }): Observable<T> {
    const detail = typeof error.error === 'string' && error.error.length ? error.error : error.message;
    this.commService.emitError(detail);
    return throwError(() => error);
  }
}

interface OrderError {
  status?: number;
  error?: { problems?: string[]; quote?: Quote } | string | null;
}

/** Extracts the readable problems from an order creation failure (409 with problems, or a plain text body). */
export const orderProblems = (error: OrderError): string[] => {
  if (error?.status === 409 && error.error && typeof error.error === 'object' && error.error.problems?.length) {
    return error.error.problems;
  }
  if (typeof error?.error === 'string' && error.error.length) {
    return [error.error];
  }
  return [];
};
