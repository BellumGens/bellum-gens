import { Injectable, inject } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Order, Promo } from '../models/order';
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

  public submitOrder(order: Order) {
    return this.http.post<Order>(`${this._apiEndpoint}/shop/order`, order);
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
    );;
  }

  public checkForPromo(code: string) {
    return this.http.get<Promo>(`${this._apiEndpoint}/shop/promo?code=${code}`);
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
