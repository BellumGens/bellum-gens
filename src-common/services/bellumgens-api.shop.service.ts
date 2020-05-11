import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { JerseyOrder, Promo } from '../models/jerseyorder';

@Injectable({
  providedIn: 'root'
})
export class ApiShopService {
  private _apiEndpoint = environment.apiEndpoint;

  constructor(private http: HttpClient) { }

  public submitOrder(order: JerseyOrder) {
    return this.http.post<JerseyOrder>(`${this._apiEndpoint}/shop/order`, order);
  }

  public checkForPromo(code: string) {
    return this.http.get<Promo>(`${this._apiEndpoint}/shop/promo?code=${code}`);
  }

  public getOrders() {
    return this.http.get<JerseyOrder []>(`${this._apiEndpoint}/shop/orders`, { withCredentials: true });
  }

  public confirmOrder(order: JerseyOrder) {
    return this.http.put(`${this._apiEndpoint}/shop/edit?orderId=${order.id}`, order, { withCredentials: true });
  }
}
