import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CSGOMapPool } from '../models/csgomaps';
import { environment } from '../environments/environment';
import { CSGOStrategy, StrategyComment, StrategyVote, VoteDirection } from '../models/csgostrategy';
import { CommunicationService } from './communication.service';

const PAGE_SIZE = 25;
@Injectable({
  providedIn: 'root'
})
export class ApiStrategiesService {
  public hasMoreStrats = new BehaviorSubject<boolean>(false);
  public loadingStrategies = new BehaviorSubject<boolean>(false);

  private _apiEndpoint = environment.apiEndpoint;
  private _currentStrategy = new BehaviorSubject<CSGOStrategy>(null);
  private _strategies = new BehaviorSubject<CSGOStrategy []>([]);

  constructor(private http: HttpClient, private commService: CommunicationService) { }

  public get strategies() {
    if (!this._strategies.value.length) {
      this.loadingStrategies.next(true);
      this.getStrategies().subscribe(
        data => {
          this._strategies.next(data);
          this.loadingStrategies.next(false);
          this.hasMoreStrats.next(data.length === PAGE_SIZE);
        },
        error => {
          this.loadingStrategies.next(false);
          this.commService.emitError(error.error);
        });
    }
    return this._strategies;
  }

  public loadStrategiesPage(page: number) {
    this.getStrategies(page).subscribe(
      data => {
        this._strategies.next(this._strategies.value.concat(data));
        this.loadingStrategies.next(false);
        this.hasMoreStrats.next(data.length === PAGE_SIZE);
      },
      error => {
        this.loadingStrategies.next(false);
        this.commService.emitError(error.error);
      }
    );
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

  public getCurrentStrategy(stratId: string) {
    if (!this._currentStrategy.value || this._currentStrategy.value.id !== stratId) {
      this.getTeamStrat(stratId).subscribe(strat => this._currentStrategy.next(strat));
    }
    return this._currentStrategy;
  }

  public submitStrategy(strat: CSGOStrategy) {
    return this.http.post<CSGOStrategy>(`${this._apiEndpoint}/strategy/strategy`, strat, { withCredentials: true }).pipe(
      map(response => {
        this._currentStrategy.next(response);
        this.commService.emitSuccess('Strategy saved!');
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.error);
        return throwError(error);
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
        this.commService.emitError(error.error);
        return throwError(error);
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
        this.commService.emitError(error.error);
        return throwError(error);
      })
    );
  }

  public deleteStratComment(comment: StrategyComment, strat: CSGOStrategy) {
    return this.http.delete<StrategyComment>(`${this._apiEndpoint}/strategy/comment?id=${comment.id}`,
                          { withCredentials: true }).pipe(
      map(response => {
        this.commService.emitSuccess('Comment submitted successfully!');
        strat.comments.splice(strat.comments.indexOf(comment), 1);
        return response;
      }),
      catchError(error => {
        this.commService.emitError(error.error);
        return throwError(error);
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
        this.commService.emitError(error.error);
        return throwError(error);
      })
    );
  }

  private getStrategies(page: number = 0) {
    return this.http.get<CSGOStrategy []>(`${this._apiEndpoint}/strategy/strategies?page=${page}`);
  }
}
