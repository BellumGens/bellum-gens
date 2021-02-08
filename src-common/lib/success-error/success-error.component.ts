import { Component, ViewChild, OnDestroy } from '@angular/core';
import { IgxSnackbarComponent } from '@infragistics/igniteui-angular';
import { CommunicationService } from '../../services/communication.service';

@Component({
  selector: 'bg-success-error',
  templateUrl: './success-error.component.html',
  styleUrls: ['./success-error.component.css']
})
export class SuccessErrorComponent implements OnDestroy {
  @ViewChild('error', { static: true }) public error: IgxSnackbarComponent;
  @ViewChild('success', { static: true }) public success: IgxSnackbarComponent;
  @ViewChild('message', { static: true }) public message: IgxSnackbarComponent;

  public successMsg = 'Success...';
  public errorMsg = 'Error has occurred...';
  public notificationMsg = '';

  constructor(private commService: CommunicationService) {
    this.commService.error.subscribe(message => this.showError(message));
    this.commService.success.subscribe(message => this.showSuccess(message));
    this.commService.message.subscribe(message => this.showMessage(message));
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

  public ngOnDestroy() {
    this.commService.error.unsubscribe();
    this.commService.success.unsubscribe();
    this.commService.message.unsubscribe();
  }
}
