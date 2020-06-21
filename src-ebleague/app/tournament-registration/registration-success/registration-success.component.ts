import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TournamentApplication } from 'src-common/models/tournament';

@Component({
  selector: 'app-registration-success',
  templateUrl: './registration-success.component.html',
  styleUrls: ['./registration-success.component.scss']
})
export class RegistrationSuccessComponent {

  public bankaccountinfo = {
    bank: 'ОББ',
    name: 'Белум Генс',
    bic: 'UBBSBGSF',
    account: 'BG90UBBS80021087375040'
  };
  public application: TournamentApplication;

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    if (nav) {
      this.application = nav.extras.state as TournamentApplication;
    }
  }

}
