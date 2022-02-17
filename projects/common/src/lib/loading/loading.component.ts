import { Component, NgModule } from '@angular/core';
import { IgxProgressBarModule } from '@infragistics/igniteui-angular';

@Component({
  selector: 'bg-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent {}

@NgModule({
  declarations: [
    LoadingComponent
  ],
  exports: [
    LoadingComponent
  ],
  imports: [
    IgxProgressBarModule
  ]
})
export class LoadingModule {}
