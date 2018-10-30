import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { IgxToggleDirective} from 'igniteui-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public title: string;

  @ViewChild(IgxToggleDirective) public toggle: IgxToggleDirective;
  @ViewChild('userButton') public userButton: ElementRef;

  constructor() {
  }

  public ngOnInit(): void {
  }
}
