import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ApplicationUser } from '../models/applicationuser';
import { UnreadNotificationsPipe } from '../pipes/unread-notifications.pipe';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  @Input()
  public authUser: ApplicationUser;

  @Output()
  public loaded = new EventEmitter<number>();

  private unreadPipe = new UnreadNotificationsPipe();

  constructor() { }

  ngOnInit() {
  }

  public aggregate(args: any[]) {
    const unread = this.unreadPipe.transform(args);
    if (unread > 0) {
      this.loaded.emit(unread);
    }
  }

  public changed(args: number) {
    this.loaded.emit(args);
  }

}
