import { Component, OnInit } from '@angular/core';
import { CSGOStrategy } from '../models/csgoteamstrategy';

@Component({
  selector: 'app-strategies',
  templateUrl: './strategies.component.html',
  styleUrls: ['./strategies.component.css']
})
export class StrategiesComponent implements OnInit {

  public strats: CSGOStrategy [];

  constructor() { }

  ngOnInit() {
  }

}
