import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  private _headerTitle = 'Bellum Gens';

  constructor() { }

  public get title() {
    return this._headerTitle;
  }

  public set title(value: string) {
    this._headerTitle = value;
    this.headerTitle.emit(this._headerTitle);
  }

  public headerTitle = new EventEmitter<string>();
  public success = new EventEmitter<string>();
  public error = new EventEmitter<string>();
  public message = new EventEmitter<string>();
  public openTeams = new EventEmitter();

  public emitOpenTeams() {
    this.openTeams.emit();
  }

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
