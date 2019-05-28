import { Component } from '@angular/core';
import { LoginService } from '../services/login.service';
import { ApplicationUser } from '../models/applicationuser';
import { Router } from '@angular/router';
import { BaseComponent } from '../base/base.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent extends BaseComponent {
  authUser: ApplicationUser;

  constructor(private authManager: LoginService, private router: Router, private title: Title) {
    super();
    this.title.setTitle('Bellum Gens: CS:GO team management');
    this.subs.push(this.authManager.applicationUser.subscribe(data => this.authUser = data));
  }

  public viewStats(id: string) {
    this.router.navigate(['/players', id]);
  }

}
