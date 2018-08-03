import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SteamUser } from '../models/steamuser';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BellumgensApiService {
  private _apiEndpoint = 'http://localhost:25702/api/users';
  private _rootApiEndpoint = 'http://localhost:25702';

  constructor(private http: HttpClient) { }

  public activeUsers(): Observable<SteamUser []> {
    return this.http.get<SteamUser []>(this._apiEndpoint + '/activeusers');
  }
}
