import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-add-steam',
  templateUrl: './add-steam.component.html',
  styleUrls: ['./add-steam.component.css']
})
export class AddSteamComponent implements OnInit {

  constructor(private authManager: LoginService) { }

  ngOnInit() {
  }

  public login(provider: string) {
    this.authManager.login(provider);
  }
}
