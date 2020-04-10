import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { JerseyOrder } from '../models/jerseyorder';

@Injectable({
  providedIn: 'root'
})
export class ApiShopService {
  private _apiEndpoint = environment.apiEndpoint;

  constructor(private http: HttpClient) { }

  public submitOrder(order: JerseyOrder) {
    return this.http.post<JerseyOrder>(`${this._apiEndpoint}/shop/order`, order);
  }
}
