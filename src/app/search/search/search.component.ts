import { Component, Input } from '@angular/core';
import { ApplicationUser } from 'src/app/models/applicationuser';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent {
  @Input()
  public authUser: ApplicationUser;

  constructor() {
  }
}
