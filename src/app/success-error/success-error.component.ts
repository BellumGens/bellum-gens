import { Component, ViewChild } from '@angular/core';
import { IgxSnackbarComponent } from 'igniteui-angular';
import { BaseComponent } from '../base/base.component';
import { CommunicationService } from '../services/communication.service';

@Component({
  selector: 'app-success-error',
  templateUrl: './success-error.component.html',
  styleUrls: ['./success-error.component.css']
})
export class SuccessErrorComponent extends BaseComponent {
  @ViewChild('error', { static: true }) public error: IgxSnackbarComponent;
  @ViewChild('success', { static: true }) public success: IgxSnackbarComponent;
  @ViewChild('message', { static: true }) public message: IgxSnackbarComponent;

  public successMsg = 'Success...';
  public errorMsg = 'Error has occurred...';
  public notificationMsg = '';

  constructor(private commService: CommunicationService) {
    super();
    this.subs.push(this.commService.error.subscribe(message => this.showError(message)));
    this.subs.push(this.commService.success.subscribe(message => this.showSuccess(message)));
    this.subs.push(this.commService.message.subscribe(message => this.showMessage(message)));
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
