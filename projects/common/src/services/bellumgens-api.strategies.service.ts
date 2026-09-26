import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, WritableSignal, inject, signal, untracked } from '@angular/core';
import { Observable, throwError } from 'rxjs';
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

  private _hasMoreStrats = signal(false);
  private _loadingStrategies = signal(false);
  public readonly hasMoreStrats = this._hasMoreStrats.asReadonly();
  public readonly loadingStrategies = this._loadingStrategies.asReadonly();

  private _apiEndpoint = environment.apiEndpoint;
  private _strategyCache = new Map<string, WritableSignal<CSGOStrategy>>();
  private _strategies = signal<CSGOStrategy []>([]);
  private _strategiesReadonly = this._strategies.asReadonly();
  private readonly PAGE_SIZE = 25;

  public get strategies(): Signal<CSGOStrategy []> {
    untracked(() => {
      if (!this._strategies().length && !this._loadingStrategies()) {
        this.loadStrategiesPage(0);
      }
    });
    return this._strategiesReadonly;
  }

  public loadStrategiesPage(page: number) {
    this._loadingStrategies.set(true);
    this.getStrategies(page).subscribe({
      next: data => {
        this._strategies.set(data);
        this._loadingStrategies.set(false);
        this._hasMoreStrats.set(data.length === this.PAGE_SIZE);
      },
      error: () => this._loadingStrategies.set(false)
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

  public getStrategy(stratId: string): Signal<CSGOStrategy> {
    return untracked(() => {
      if (!this._strategyCache.has(stratId)) {
        const cached = signal<CSGOStrategy>(null);
        this._strategyCache.set(stratId, cached);
        this.getTeamStrat(stratId).subscribe(strat => cached.set(strat));
      }
      return this._strategyCache.get(stratId).asReadonly();
    });
  }

  public submitStrategy(strat: CSGOStrategy) {
    return this.http.post<CSGOStrategy>(`${this._apiEndpoint}/strategy/strategy`, strat, { withCredentials: true }).pipe(
      map(response => {
        if (this._strategyCache.has(strat.id)) {
          this._strategyCache.get(strat.id).set(response);
        } else {
          this._strategyCache.set(strat.id, signal(strat));
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

  /**
   * Submits a vote and emits the strategy with its votes updated. The given strategy is not mutated:
   * a new strategy object replaces it in the service caches, and callers holding their own copy should swap it in.
   */
  public submitStratVote(strat: CSGOStrategy, direction: VoteDirection, userId: string): Observable<CSGOStrategy> {
    return this.http.post<StrategyVote>(`${this._apiEndpoint}/strategy/vote`,
                          { id: strat.id, direction },
                          { withCredentials: true }).pipe(
      map(response => {
        const votes = strat.votes || [];
        const hasVoted = votes.some(v => v.userId === userId);
        let updatedVotes: StrategyVote [];
        if (response) {
          this.commService.emitSuccess('Vote submitted successfully!');
          updatedVotes = hasVoted
            ? votes.map(v => v.userId === userId ? { ...v, vote: response.vote } : v)
            : [...votes, response];
        } else {
          this.commService.emitSuccess('Vote removed successfully!');
          updatedVotes = votes.filter(v => v.userId !== userId);
        }
        return this.patchStrategy(strat, { votes: updatedVotes });
      }),
      catchError(error => {
        this.commService.emitError(error.message);
        return throwError(() => error);
      })
    );
  }

  /**
   * Submits a new or edited comment and emits the strategy with its comments updated (the given strategy is not mutated).
   */
  public submitStratComment(comment: StrategyComment, strat: CSGOStrategy): Observable<CSGOStrategy> {
    return this.http.post<StrategyComment>(`${this._apiEndpoint}/strategy/comment`,
                          comment,
                          { withCredentials: true }).pipe(
      map(response => {
        const comments = strat.comments || [];
        const isEdit = comments.some(c => c.id === response.id);
        let updatedComments: StrategyComment [];
        if (isEdit) {
          updatedComments = comments.map(c => c.id === response.id ? { ...c, comment: response.comment } : c);
          this.commService.emitSuccess('Comment edited successfully!');
        } else {
          updatedComments = [...comments, response];
          this.commService.emitSuccess('Comment submitted successfully!');
        }
        return this.patchStrategy(strat, { comments: updatedComments });
      }),
      catchError(error => {
        this.commService.emitError(error.message);
        return throwError(() => error);
      })
    );
  }

  /**
   * Deletes a comment and emits the strategy without it (the given strategy is not mutated).
   */
  public deleteStratComment(comment: StrategyComment, strat: CSGOStrategy): Observable<CSGOStrategy> {
    return this.http.delete<StrategyComment>(`${this._apiEndpoint}/strategy/comment?id=${comment.id}`,
                          { withCredentials: true }).pipe(
      map(() => {
        this.commService.emitSuccess('Comment deleted successfully!');
        const comments = (strat.comments || []).filter(c => c !== comment && !(comment.id && c.id === comment.id));
        return this.patchStrategy(strat, { comments });
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
        this._strategies.update(strats => strats.some(s => s.id === id) ? strats.filter(s => s.id !== id) : strats);
        this._strategyCache.forEach((cached, key) => {
          if (cached()?.id === id) {
            this._strategyCache.delete(key);
          }
        });
        this.commService.emitSuccess('Strategy successfully deleted!');
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.message);
        return throwError(() => error);
      })
    );
  }

  /**
   * Applies the patch to the given strategy without mutating it, swaps the result into every cache that
   * holds that strategy (the strategies page and the per-strategy cache, which may be keyed by id or by
   * custom url) and returns it.
   */
  private patchStrategy(strat: CSGOStrategy, patch: Partial<CSGOStrategy>): CSGOStrategy {
    const updated: CSGOStrategy = { ...strat, ...patch };
    const apply = (cached: CSGOStrategy) => cached === strat ? updated : { ...cached, ...patch };
    this._strategies.update(strats => strats.some(s => s.id === strat.id)
      ? strats.map(s => s.id === strat.id ? apply(s) : s)
      : strats);
    this._strategyCache.forEach(cached => {
      const current = cached();
      if (current?.id === strat.id) {
        cached.set(apply(current));
      }
    });
    return updated;
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
