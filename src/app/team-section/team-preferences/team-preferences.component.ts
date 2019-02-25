import { Component, OnInit, Input } from '@angular/core';
import { BellumgensApiService } from 'src/app/services/bellumgens-api.service';

@Component({
  selector: 'app-team-preferences',
  templateUrl: './team-preferences.component.html',
  styleUrls: ['./team-preferences.component.css']
})
export class TeamPreferencesComponent implements OnInit {

  @Input()
  isAdmin = false;

  constructor(private apiService: BellumgensApiService) { }

  ngOnInit() {
  }

}
