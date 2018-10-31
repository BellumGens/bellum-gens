import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { ApplicationUser } from '../models/applicationuser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  authUser: ApplicationUser;

  constructor(private authManager: LoginService) { }

  ngOnInit() {
    this.authManager.applicationUser.subscribe(data => this.authUser = data);
  }

}
