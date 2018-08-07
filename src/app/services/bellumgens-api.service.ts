import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SteamUserWithStats } from '../models/steamuser';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BellumgensApiService {
  private _apiEndpoint = 'http://localhost:25702/api/users';
  private _rootApiEndpoint = 'http://localhost:25702';
  private _dataSubject = new ReplaySubject<SteamUserWithStats []>(1);

  public activeUsers: Observable<SteamUserWithStats []> = this._dataSubject.asObservable();

  constructor(private http: HttpClient) { }

  public getActiveUsers(): void {
    this.http.get<SteamUserWithStats []>(this._apiEndpoint + '/activeusers').subscribe(
      data => this._dataSubject.next(data)
    );
  }
}
