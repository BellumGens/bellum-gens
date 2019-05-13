import { Component, OnInit, ViewChild } from '@angular/core';
import { IgxSnackbarComponent } from 'igniteui-angular';
import { BellumgensApiService } from '../services/bellumgens-api.service';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-success-error',
  templateUrl: './success-error.component.html',
  styleUrls: ['./success-error.component.css']
})
export class SuccessErrorComponent extends BaseComponent {
  @ViewChild('error') public error: IgxSnackbarComponent;
  @ViewChild('success') public success: IgxSnackbarComponent;
  @ViewChild('message') public message: IgxSnackbarComponent;

  public successMsg = 'Success...';
  public errorMsg = 'Error has occurred...';
  public notificationMsg = '';

  constructor(private apiService: BellumgensApiService) {
    super();
    this.subs.push(this.apiService.error.subscribe(message => this.showError(message)));
    this.subs.push(this.apiService.success.subscribe(message => this.showSuccess(message)));
    this.subs.push(this.apiService.message.subscribe(message => this.showMessage(message)));
  }

  public showSuccess(msg?: string) {
    if (msg) {
      this.successMsg = msg;
    }
    this.success.show();
  }

  public showError(msg?: string) {
    if (msg) {
      this.errorMsg = msg;
    }
    this.error.show();
  }

  public showMessage(msg?: string) {
    if (msg) {
      this.notificationMsg = msg;
    }
    this.message.show();
  }
}
