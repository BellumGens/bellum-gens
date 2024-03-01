import { Component } from '@angular/core';
import { IgxCircularProgressBarComponent } from '@infragistics/igniteui-angular';

@Component({
    selector: 'bg-loading',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.scss'],
    standalone: true,
    imports: [IgxCircularProgressBarComponent]
})
export class LoadingComponent {}


