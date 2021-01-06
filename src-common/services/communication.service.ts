import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  public success = new EventEmitter<string>();
  public error = new EventEmitter<string>();
  public message = new EventEmitter<string>();

  constructor() { }

  public emitError(error: string) {
    this.error.emit(error);
  }

  public emitSuccess(success: string) {
    this.success.emit(success);
  }

  public emitMessage(message: string) {
    this.message.emit(message);
  }
}
