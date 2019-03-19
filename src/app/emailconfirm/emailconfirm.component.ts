import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-emailconfirm',
  templateUrl: './emailconfirm.component.html',
  styleUrls: ['./emailconfirm.component.css']
})
export class EmailconfirmComponent implements OnInit {
  public message = 'Email confirmed successfully!';

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      if (params['error']) {
        this.message = ':( Error confirming your email address!';
      }
    });
  }

  ngOnInit() {
  }

}
