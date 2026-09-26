import { Component, inject, signal, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IgxIconComponent } from '@infragistics/igniteui-angular/icon';
import { IgxSnackbarComponent } from '@infragistics/igniteui-angular/snackbar';
import { CommunicationService } from '../../services/communication.service';

@Component({
    selector: 'bg-success-error',
    templateUrl: './success-error.component.html',
    styleUrls: ['./success-error.component.scss'],    imports: [IgxSnackbarComponent, IgxIconComponent]
})
export class SuccessErrorComponent {
  private commService = inject(CommunicationService);

  public message = viewChild.required<IgxSnackbarComponent>('message');

  public successMsg = 'Success...';
  public errorMsg = 'Error has occurred...';
  public notificationMsg = signal('');
  public icon = signal('done');
  public class = signal('color-success');

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
    this.commService.error.pipe(takeUntilDestroyed())
      .subscribe(message => this.showMessage('error', message));
    this.commService.success.pipe(takeUntilDestroyed())
      .subscribe(message => this.showMessage('success', message));
    this.commService.message.pipe(takeUntilDestroyed())
      .subscribe(message => this.showMessage('warn', message));
  }

  public showMessage(type: string, msg?: string) {
    if (msg) {
      this.notificationMsg.set(msg);
    }
    this.icon.set(this.settings[type].icon);
    this.class.set(this.settings[type].class);
    this.message().open();
  }
}


