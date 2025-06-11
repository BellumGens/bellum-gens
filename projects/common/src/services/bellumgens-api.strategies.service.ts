import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CSGOMapPool } from '../models/csgomaps';
import { environment } from '../environments/environment';
import { CSGOStrategy, StrategyComment, StrategyVote, VoteDirection } from '../models/csgostrategy';
import { CommunicationService } from './communication.service';

@Injectable({
  providedIn: 'root'
})
export class ApiStrategiesService {
  private http = inject(HttpClient);
  private commService = inject(CommunicationService);

  public hasMoreStrats = new BehaviorSubject<boolean>(false);
  public loadingStrategies = new BehaviorSubject<boolean>(false);

  private _apiEndpoint = environment.apiEndpoint;
  private _strategyCache = new Map<string, BehaviorSubject<CSGOStrategy>>();
  private _strategies = new BehaviorSubject<CSGOStrategy []>([]);
  private readonly PAGE_SIZE = 25;

  public get strategies() {
    if (!this._strategies.value.length) {
      this.loadingStrategies.next(true);
      this.getStrategies().subscribe({
        next: data => {
          this._strategies.next(data);
          this.loadingStrategies.next(false);
          this.hasMoreStrats.next(data.length === this.PAGE_SIZE);
        },
        error: () => this.loadingStrategies.next(false)
      });
    }
    return this._strategies;
  }

  public loadStrategiesPage(page: number) {
    this.loadingStrategies.next(true);
    this.getStrategies(page).subscribe({
      next: data => {
        this._strategies.next(data);
        this.loadingStrategies.next(false);
        this.hasMoreStrats.next(data.length === this.PAGE_SIZE);
      },
      error: () => this.loadingStrategies.next(false)
    });
  }

  public getUserStrategies(userId: string) {
    return this.http.get<CSGOStrategy []>(`${this._apiEndpoint}/strategy/userstrats?userid=${userId}`, { withCredentials: true });
  }

  public getTeamStrat(stratId: string) {
    return this.http.get<CSGOStrategy>(`${this._apiEndpoint}/strategy/strat?stratId=${stratId}`, { withCredentials: true });
  }

  public getTeamStrats(teamId: string) {
    return this.http.get<CSGOStrategy []>(`${this._apiEndpoint}/strategy/teamstrats?teamid=${teamId}`, { withCredentials: true });
  }

  public getTeamMapPool(teamId: string) {
    return this.http.get<CSGOMapPool []>(`${this._apiEndpoint}/teams/mapPool?teamId=${teamId}`, { withCredentials: true });
  }

  public getStrategy(stratId: string) {
    if (!this._strategyCache.has(stratId)) {
      this._strategyCache.set(stratId, new BehaviorSubject(null));
      this.getTeamStrat(stratId).subscribe(strat => {
        this._strategyCache.get(stratId).next(strat);
      });
    }
    return this._strategyCache.get(stratId);
  }

  public submitStrategy(strat: CSGOStrategy) {
    return this.http.post<CSGOStrategy>(`${this._apiEndpoint}/strategy/strategy`, strat, { withCredentials: true }).pipe(
      map(response => {
        if (this._strategyCache.has(strat.id)) {
          this._strategyCache.get(strat.id).next(response);
        } else {
          this._strategyCache.set(strat.id, new BehaviorSubject(strat));
        }
        this.commService.emitSuccess('Strategy saved!');
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.message);
        return throwError(() => error);
      })
    );
  }

  public submitStratVote(strat: CSGOStrategy, direction: VoteDirection, userId: string) {
    return this.http.post<StrategyVote>(`${this._apiEndpoint}/strategy/vote`,
                          { id: strat.id, direction },
                          { withCredentials: true }).pipe(
      map(response => {
        const vote = strat.votes.find(v => v.userId === userId);
        if (response) {
          this.commService.emitSuccess('Vote submitted successfully!');
          if (vote) {
            vote.vote = response.vote;
          } else {
            strat.votes.push(response);
          }
        } else {
          this.commService.emitSuccess('Vote removed successfully!');
          strat.votes.splice(strat.votes.indexOf(vote), 1);
        }
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.message);
        return throwError(() => error);
      })
    );
  }

  public submitStratComment(comment: StrategyComment, strat: CSGOStrategy) {
    return this.http.post<StrategyComment>(`${this._apiEndpoint}/strategy/comment`,
                          comment,
                          { withCredentials: true }).pipe(
      map(response => {
        const existing = strat.comments.find(c => c.id === response.id);
        if (existing) {
          existing.comment = response.comment;
          this.commService.emitSuccess('Comment edited successfully!');
        } else {
          strat.comments.push(response);
          this.commService.emitSuccess('Comment submitted successfully!');
        }
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.message);
        return throwError(() => error);
      })
    );
  }

  public deleteStratComment(comment: StrategyComment, strat: CSGOStrategy) {
    return this.http.delete<StrategyComment>(`${this._apiEndpoint}/strategy/comment?id=${comment.id}`,
                          { withCredentials: true }).pipe(
      map(response => {
        this.commService.emitSuccess('Comment deleted successfully!');
        strat.comments.splice(strat.comments.indexOf(comment), 1);
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.message);
        return throwError(() => error);
      })
    );
  }

  public deleteStrategy(id: string) {
    return this.http.delete(`${this._apiEndpoint}/strategy/strat?id=${id}`, { withCredentials: true }).pipe(
      map(response => {
        this.commService.emitSuccess('Strategy successfully deleted!');
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.message);
        return throwError(() => error);
      })
    );
  }

  // TODO: Refactor to send page size as well
  private getStrategies(page: number = 0) {
    return this.http.get<CSGOStrategy []>(`${this._apiEndpoint}/strategy/strategies?page=${page}`).pipe(
      map(response => {
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.message);
        return throwError(() => error);
      })
    );
  }
}
