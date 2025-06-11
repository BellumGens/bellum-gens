import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { CSGOTeam } from '../models/csgoteam';
import { SearchResult } from '../models/searchresult';
import { CSGOStrategy } from '../models/csgostrategy';
import { BehaviorSubject, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { catchError, map } from 'rxjs/operators';
import { CommunicationService } from './communication.service';
import { ApplicationUser } from '../models/applicationuser';

@Injectable({
  providedIn: 'root'
})
export class ApiSearchService {
  private http = inject(HttpClient);
  private commService = inject(CommunicationService);

  public loadingQuickSearch = new BehaviorSubject<boolean>(false);
  public loadingSearch = new BehaviorSubject<boolean>(false);
  public searchResult = new BehaviorSubject<SearchResult>(null);
  public playerSearchResult = new BehaviorSubject<ApplicationUser []>(null);
  public teamSearchResult = new BehaviorSubject<CSGOTeam []>(null);
  public strategySearchResult = new BehaviorSubject<CSGOStrategy []>(null);
  public searchTerm = new BehaviorSubject<string>(null);

  private _apiEndpoint = environment.apiEndpoint;
  private _searchResultCache: Map<string, SearchResult> = new Map();
  private _playerSearchCache: Map<string, ApplicationUser []> = new Map();
  private _teamSearchCache: Map<string, CSGOTeam []> = new Map();
  private _strategySearchCache: Map<string, CSGOStrategy []> = new Map();

  public quickSearch(name: string) {
    this.searchTerm.next(name);
    if (this._searchResultCache.has(name)) {
      this.searchResult.next(this._searchResultCache.get(name));
    } else {
      this.loadingQuickSearch.next(true);
      this.getQuickSearch(name).subscribe({
        next: data => {
          this._searchResultCache.set(name, data);
          this.searchResult.next(data);
          this.loadingQuickSearch.next(false);
        },
        error: () => this.loadingQuickSearch.next(false)
      });
    }
  }

  public searchTeams(query: string) {
    if (this._teamSearchCache.has(query)) {
      this.teamSearchResult.next(this._teamSearchCache.get(query));
    } else {
      if (query.startsWith('name')) {
        const val = query.split('=')[1];
        if (this._searchResultCache.has(val)) {
          this.teamSearchResult.next(this._searchResultCache.get(val).teams);
        }
      } else {
        this.teamSearchResult.next([]);
        this.loadingSearch.next(true);
        this.getFilteredTeams(query).subscribe({
          next: teams => {
            this._teamSearchCache.set(query, teams);
            this.teamSearchResult.next(teams);
            this.loadingSearch.next(false);
          },
          error: () => this.loadingSearch.next(false)
        });
      }
    }
  }

  public searchPlayers(query: string) {
    if (this._playerSearchCache.has(query)) {
      this.playerSearchResult.next(this._playerSearchCache.get(query));
    } else {
      if (query.startsWith('name')) {
        const val = query.split('=')[1];
        if (this._searchResultCache.has(val)) {
          this.playerSearchResult.next(this._searchResultCache.get(val).players);
        }
      } else {
        this.playerSearchResult.next([]);
        this.loadingSearch.next(true);
        this.getFilteredPlayers(query).subscribe({
          next: players => {
            this._playerSearchCache.set(query, players);
            this.playerSearchResult.next(players);
            this.loadingSearch.next(false);
          },
          error: () => this.loadingSearch.next(false)
        });
      }
    }
  }

  public searchStrategies(query: string) {
    if (this._strategySearchCache.has(query)) {
      this.strategySearchResult.next(this._strategySearchCache.get(query));
    } else {
      if (query.startsWith('name')) {
        const val = query.split('=')[1];
        if (this._searchResultCache.has(val)) {
          this.strategySearchResult.next(this._searchResultCache.get(val).strategies);
        }
      } else {
        this.strategySearchResult.next([]);
        this.loadingSearch.next(true);
        this.getFilteredStrategies(query).subscribe({
          next: strategies => {
            this._strategySearchCache.set(query, strategies);
            this.strategySearchResult.next(strategies);
            this.loadingSearch.next(false);
          },
          error: () => this.loadingSearch.next(false)
        });
      }
    }
  }

  private getQuickSearch(name: string) {
    return this.http.get<SearchResult>(`${this._apiEndpoint}/search?name=${name}`).pipe(
      map(response => response),
      catchError(error => {
        this.commService.emitError(error.message);
        return throwError(() => error);
      })
    );
  }

  private getFilteredStrategies(query: string) {
    return this.http.get<CSGOStrategy []>(`${this._apiEndpoint}/search/strategies?${query}`).pipe(
      map(response => response),
      catchError(error => {
        this.commService.emitError(error.message);
        return throwError(() => error);
      })
    );
  }

  private getFilteredPlayers(query: string) {
    return this.http.get<ApplicationUser []>(`${this._apiEndpoint}/search/players?${query}`, { withCredentials: true }).pipe(
      map(response => response),
      catchError(error => {
        this.commService.emitError(error.message);
        return throwError(() => error);
      })
    );
  }

  private getFilteredTeams(query: string) {
    return this.http.get<CSGOTeam []>(`${this._apiEndpoint}/search/teams?${query}`, { withCredentials: true }).pipe(
      map(response => response),
      catchError(error => {
        this.commService.emitError(error.message);
        return throwError(() => error);
      })
    );
  }
}
