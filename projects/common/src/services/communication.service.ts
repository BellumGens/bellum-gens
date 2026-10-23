import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * App-wide fire-and-forget notifications (success / error / info messages).
 * These are events rather than state, so they are exposed as observables.
 */
@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  private _success = new Subject<string>();
  private _error = new Subject<string>();
  private _message = new Subject<string>();

  public readonly success = this._success.asObservable();
  public readonly error = this._error.asObservable();
  public readonly message = this._message.asObservable();

  public emitError(error: string) {
    this._error.next(error);
  }

  public emitSuccess(success: string) {
    this._success.next(success);
  }

  public emitMessage(message: string) {
    this._message.next(message);
  }
}
