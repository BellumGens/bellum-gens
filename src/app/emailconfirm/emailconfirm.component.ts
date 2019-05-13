import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-emailconfirm',
  templateUrl: './emailconfirm.component.html',
  styleUrls: ['./emailconfirm.component.css']
})
export class EmailconfirmComponent extends BaseComponent {
  public message = 'Email confirmed successfully!';

  constructor(private route: ActivatedRoute) {
    super();
    this.subs.push(this.route.params.subscribe(params => {
      if (params['error']) {
        this.message = ':( Error confirming your email address!';
      }
    }));
  }

}
