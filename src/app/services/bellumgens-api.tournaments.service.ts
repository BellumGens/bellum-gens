import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommunicationService } from './communication.service';
import { BehaviorSubject, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { map, catchError } from 'rxjs/operators';
import { TournamentApplication } from '../models/tournament';

@Injectable({
  providedIn: 'root'
})
export class ApiTournamentsService {
  private _apiEndpoint = environment.apiEndpoint;

  private _companies = new BehaviorSubject<string []>(null);
  private _registrations = new BehaviorSubject<TournamentApplication []>(null);

  constructor(private http: HttpClient, private commService: CommunicationService) { }

  public get companies() {
    if (!this._companies.value) {
      this.getCompanies().subscribe(data => {
        this._companies.next(data);
      });
    }
    return this._companies;
  }

  public get registrations() {
    if (!this._registrations.value) {
      this.getRegistrations().subscribe(data => {
        this._registrations.next(data);
      });
    }
    return this._registrations;
  }

  public addSubscriber(email: string) {
    return this.http.post(`${this._apiEndpoint}/account/subscribe`, { Email: email }).pipe(
      map(response => {
        if (response) {
          this.commService.emitSuccess(response.toString());
        }
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.error.Message);
        return throwError(error);
      })
    );
  }

  public leagueRegistration(application: TournamentApplication) {
    return this.http.post<TournamentApplication>(`${this._apiEndpoint}/tournament/register`, application, { withCredentials: true }).pipe(
      map(response => {
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.error.Message);
        return throwError(error);
      })
    );
  }

  public updateRegistrations() {
    this.getRegistrations().subscribe(data => {
      this._registrations.next(data);
    });
  }

  private getRegistrations() {
    return this.http.get<TournamentApplication []>(`${this._apiEndpoint}/tournament/registrations`, { withCredentials: true});
  }

  private getCompanies() {
    return this.http.get<string []>(`${this._apiEndpoint}/companies`);
  }
}
