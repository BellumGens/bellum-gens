import { Component, Input, EventEmitter, Output, ViewChild, NgModule } from '@angular/core';
import { IDialogEventArgs, IgxDialogComponent, IgxDialogModule } from '@infragistics/igniteui-angular';

@Component({
  selector: 'bg-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent {
  @Input()
  public title = '';

  @Output()
  public ok = new EventEmitter<any>();

  @Output()
  public cancel = new EventEmitter<IDialogEventArgs>();

  @ViewChild(IgxDialogComponent, { static: true })
  public dialog: IgxDialogComponent;

  private confirmEntity: any;

  constructor() { }

  public okClicked() {
    this.ok.emit(this.confirmEntity);
    this.dialog.close();
  }

  public cancelClicked(args: IDialogEventArgs) {
    this.cancel.emit(args);
    this.dialog.close();
  }

  public onClose() {
    this.confirmEntity = null;
  }

  public open(entity?) {
    this.confirmEntity = entity;
    this.dialog.open();
  }
}

@NgModule({
  declarations: [
    ConfirmComponent
  ],
  exports: [
    ConfirmComponent
  ],
  imports: [
    IgxDialogModule
  ]
})
export class ConfirmModule {}
