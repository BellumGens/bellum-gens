import { Component, input, output, viewChild } from '@angular/core';
import { IDialogEventArgs, IgxDialogComponent } from '@infragistics/igniteui-angular/dialog';

@Component({
  selector: 'bg-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css'],
  imports: [IgxDialogComponent]
})
export class ConfirmComponent {
  public title = input('');

  public ok = output<any>();

  // eslint-disable-next-line @angular-eslint/no-output-native
  public cancel = output<IDialogEventArgs>();

  public dialog = viewChild.required(IgxDialogComponent);

  private confirmEntity: any;

  public okClicked() {
    this.ok.emit(this.confirmEntity);
    this.dialog().close();
  }

  public cancelClicked(args: IDialogEventArgs) {
    this.cancel.emit(args);
    this.dialog().close();
  }

  public onClose() {
    this.confirmEntity = null;
  }

  public open(entity?: any) {
    this.confirmEntity = entity;
    this.dialog().open();
  }
}
