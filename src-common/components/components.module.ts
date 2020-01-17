import { ConfirmComponent } from './confirm/confirm.component';
import { NgModule } from '@angular/core';
import { IgxDialogModule } from 'igniteui-angular';

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
export class BellumGensModule {}
