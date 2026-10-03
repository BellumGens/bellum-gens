import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { CSGOTeam } from '../models/csgoteam';
import { SearchResult } from '../models/searchresult';
import { CSGOStrategy } from '../models/csgostrategy';
import { throwError } from 'rxjs';
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

  private _loadingQuickSearch = signal(false);
  private _loadingSearch = signal(false);
  private _searchResult = signal<SearchResult>(null);
  private _playerSearchResult = signal<ApplicationUser []>(null);
  private _teamSearchResult = signal<CSGOTeam []>(null);
  private _strategySearchResult = signal<CSGOStrategy []>(null);
  private _searchTerm = signal<string>(null);

  public readonly loadingQuickSearch = this._loadingQuickSearch.asReadonly();
  public readonly loadingSearch = this._loadingSearch.asReadonly();
  public readonly searchResult = this._searchResult.asReadonly();
  public readonly playerSearchResult = this._playerSearchResult.asReadonly();
  public readonly teamSearchResult = this._teamSearchResult.asReadonly();
  public readonly strategySearchResult = this._strategySearchResult.asReadonly();
  public readonly searchTerm = this._searchTerm.asReadonly();

  private _apiEndpoint = environment.apiEndpoint;
  private _searchResultCache: Map<string, SearchResult> = new Map();
  private _playerSearchCache: Map<string, ApplicationUser []> = new Map();
  private _teamSearchCache: Map<string, CSGOTeam []> = new Map();
  private _strategySearchCache: Map<string, CSGOStrategy []> = new Map();

  public quickSearch(name: string) {
    this._searchTerm.set(name);
    if (this._searchResultCache.has(name)) {
      this._searchResult.set(this._searchResultCache.get(name));
    } else {
      this._loadingQuickSearch.set(true);
      this.getQuickSearch(name).subscribe({
        next: data => {
          this._searchResultCache.set(name, data);
          this._searchResult.set(data);
          this._loadingQuickSearch.set(false);
        },
        error: () => this._loadingQuickSearch.set(false)
      });
    }
  }

  public searchTeams(query: string) {
    if (this._teamSearchCache.has(query)) {
      this._teamSearchResult.set(this._teamSearchCache.get(query));
    } else {
      if (query.startsWith('name')) {
        const val = query.split('=')[1];
        if (this._searchResultCache.has(val)) {
          this._teamSearchResult.set(this._searchResultCache.get(val).teams);
        }
      } else {
        this._teamSearchResult.set([]);
        this._loadingSearch.set(true);
        this.getFilteredTeams(query).subscribe({
          next: teams => {
            this._teamSearchCache.set(query, teams);
            this._teamSearchResult.set(teams);
            this._loadingSearch.set(false);
          },
          error: () => this._loadingSearch.set(false)
        });
      }
    }
  }

  public searchPlayers(query: string) {
    if (this._playerSearchCache.has(query)) {
      this._playerSearchResult.set(this._playerSearchCache.get(query));
    } else {
      if (query.startsWith('name')) {
        const val = query.split('=')[1];
        if (this._searchResultCache.has(val)) {
          this._playerSearchResult.set(this._searchResultCache.get(val).players);
        }
      } else {
        this._playerSearchResult.set([]);
        this._loadingSearch.set(true);
        this.getFilteredPlayers(query).subscribe({
          next: players => {
            this._playerSearchCache.set(query, players);
            this._playerSearchResult.set(players);
            this._loadingSearch.set(false);
          },
          error: () => this._loadingSearch.set(false)
        });
      }
    }
  }

  public searchStrategies(query: string) {
    if (this._strategySearchCache.has(query)) {
      this._strategySearchResult.set(this._strategySearchCache.get(query));
    } else {
      if (query.startsWith('name')) {
        const val = query.split('=')[1];
        if (this._searchResultCache.has(val)) {
          this._strategySearchResult.set(this._searchResultCache.get(val).strategies);
        }
      } else {
        this._strategySearchResult.set([]);
        this._loadingSearch.set(true);
        this.getFilteredStrategies(query).subscribe({
          next: strategies => {
            this._strategySearchCache.set(query, strategies);
            this._strategySearchResult.set(strategies);
            this._loadingSearch.set(false);
          },
          error: () => this._loadingSearch.set(false)
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
