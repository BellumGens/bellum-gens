import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommunicationService } from './communication.service';
import { BehaviorSubject, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { map, catchError } from 'rxjs/operators';
import { TournamentApplication, RegistrationsCount, TournamentCSGORegistration, TournamentSC2Registration } from '../models/tournament';

@Injectable({
  providedIn: 'root'
})
export class ApiTournamentsService {
  private _apiEndpoint = environment.apiEndpoint;

  private _companies = new BehaviorSubject<string []>(null);
  private _registrations = new BehaviorSubject<TournamentApplication []>(null);
  private _csgoRegistrations = new BehaviorSubject<TournamentCSGORegistration []>(null);
  private _sc2Registrations = new BehaviorSubject<TournamentSC2Registration []>(null);
  private _registrationsCount = new BehaviorSubject<RegistrationsCount []>(null);

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

  public get registrationsCount() {
    if (!this._registrationsCount.value) {
      this.getRegistrationsCount().subscribe(data => {
        this._registrationsCount.next(data);
      });
    }
    return this._registrationsCount;
  }

  public get csgoRegistrations() {
    if (!this._csgoRegistrations.value) {
      this.getCSGORegistrations().subscribe(data => {
        this._csgoRegistrations.next(data);
      });
    }
    return this._csgoRegistrations;
  }

  public get sc2Registrations() {
    if (!this._sc2Registrations.value) {
      this.getSC2Registrations().subscribe(data => {
        this._sc2Registrations.next(data);
      });
    }
    return this._sc2Registrations;
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

  public deleteRegistration(id: string) {
    return this.http.delete(`${this._apiEndpoint}/tournament/delete?id=${id}`, { withCredentials: true }).pipe(
      map(response => {
        if (response) {
          this.commService.emitSuccess('Tournament application deleted successfully!');
        }
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.error.Message);
        return throwError(error);
      })
    );
  }

  private getRegistrations() {
    return this.http.get<TournamentApplication []>(`${this._apiEndpoint}/tournament/registrations`, { withCredentials: true});
  }

  private getRegistrationsCount() {
    return this.http.get<RegistrationsCount []>(`${this._apiEndpoint}/tournament/regcount`);
  }

  private getCSGORegistrations() {
    return this.http.get<TournamentCSGORegistration []>(`${this._apiEndpoint}/tournament/csgoregs`);
  }

  private getSC2Registrations() {
    return this.http.get<TournamentSC2Registration []>(`${this._apiEndpoint}/tournament/sc2regs`);
  }

  private getCompanies() {
    return this.http.get<string []>(`${this._apiEndpoint}/companies`);
  }
}
