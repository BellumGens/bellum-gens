import { Component, OnInit, ViewChild } from '@angular/core';
import { IgxToastComponent, IgxToastPosition } from 'igniteui-angular';

@Component({
  selector: 'app-success-error',
  templateUrl: './success-error.component.html',
  styleUrls: ['./success-error.component.css']
})
export class SuccessErrorComponent implements OnInit {
  @ViewChild('error') public error: IgxToastComponent;
  @ViewChild('saveSuccess') public success: IgxToastComponent;

  constructor() { }

  ngOnInit() {
  }

  public showSuccess(msg?: string, delay?: number) {
    if (msg) {
      this.success.message = msg;
    }
    this.success.show();
  }

  public showError(msg?: string, position?: IgxToastPosition, delay?: number) {
    if (msg) {
      this.error.message = msg;
    }
    if (position) {
      this.error.position = position;
    }
    this.error.show();
  }
}
