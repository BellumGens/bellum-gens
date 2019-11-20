import { Component } from '@angular/core';
import { LoginService } from '../../../src-common/services/login.service';
import { LOGIN_ASSETS } from '../../../src-common/models/misc';

@Component({
  selector: 'app-add-steam',
  templateUrl: './add-steam.component.html',
  styleUrls: ['./add-steam.component.css']
})
export class AddSteamComponent {

  loginColor = LOGIN_ASSETS['Steam'];

  constructor(private authManager: LoginService) { }

  public login(provider: string) {
    this.authManager.login(provider);
  }
}
