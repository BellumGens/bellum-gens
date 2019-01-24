import { Component, OnInit, ViewChild } from '@angular/core';
import { IgxSnackbarComponent } from 'igniteui-angular';
import { BellumgensApiService } from '../services/bellumgens-api.service';

@Component({
  selector: 'app-success-error',
  templateUrl: './success-error.component.html',
  styleUrls: ['./success-error.component.css']
})
export class SuccessErrorComponent implements OnInit {
  @ViewChild('error') public error: IgxSnackbarComponent;
  @ViewChild('success') public success: IgxSnackbarComponent;

  constructor(private apiService: BellumgensApiService) { }

  ngOnInit() {
    this.apiService.error.subscribe(message => this.showError(message));
    this.apiService.success.subscribe(message => this.showSuccess(message));
  }

  public showSuccess(msg?: string) {
    if (msg) {
      this.success.message = msg;
    }
    this.success.show();
  }

  public showError(msg?: string) {
    if (msg) {
      this.error.message = msg;
    }
    this.error.show();
  }
}
