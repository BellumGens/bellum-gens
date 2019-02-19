import { Component, OnInit, Input } from '@angular/core';
import { ApplicationUser } from '../models/applicationuser';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  @Input()
  public authUser: ApplicationUser;

  constructor() { }

  ngOnInit() {
  }

}
