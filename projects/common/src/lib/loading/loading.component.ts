import { Component, NgModule } from '@angular/core';
import { IgxProgressBarModule } from '@infragistics/igniteui-angular';

@Component({
    selector: 'bg-loading',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.scss'],
    standalone: true,
    imports: [IgxProgressBarModule]
})
export class LoadingComponent {}


