import { Component, ViewChild, OnDestroy, inject } from '@angular/core';
import { IgxIconComponent, IgxSnackbarComponent } from '@infragistics/igniteui-angular';
import { CommunicationService } from '../../services/communication.service';

@Component({
    selector: 'bg-success-error',
    templateUrl: './success-error.component.html',
    styleUrls: ['./success-error.component.scss'],
    imports: [IgxSnackbarComponent, IgxIconComponent]
})
export class SuccessErrorComponent implements OnDestroy {
  private commService = inject(CommunicationService);

  @ViewChild('message', { static: true }) public message: IgxSnackbarComponent;

  public successMsg = 'Success...';
  public errorMsg = 'Error has occurred...';
  public notificationMsg = '';
  public icon = 'done';
  public class = 'color-success';

  private settings = {
    success: {
      icon: 'done',
      class: 'color-success'
    },
    error: {
      icon: 'error',
      class: 'color-error'
    },
    warn: {
      icon: 'priority_high',
      class: 'color-warn'
    }
  };

  constructor() {
    this.commService.error.subscribe(message => this.showMessage('error', message));
    this.commService.success.subscribe(message => this.showMessage('success', message));
    this.commService.message.subscribe(message => this.showMessage('warn', message));
  }

  public showMessage(type: string, msg?: string) {
    if (msg) {
      this.notificationMsg = msg;
    }
    this.icon = this.settings[type].icon;
    this.class = this.settings[type].class;
    this.message.open();
  }

  public ngOnDestroy() {
    this.commService.error.unsubscribe();
    this.commService.success.unsubscribe();
    this.commService.message.unsubscribe();
  }
}


