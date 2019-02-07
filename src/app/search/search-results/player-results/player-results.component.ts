import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BellumgensApiService } from 'src/app/services/bellumgens-api.service';

@Component({
  selector: 'app-player-results',
  templateUrl: './player-results.component.html',
  styleUrls: ['./player-results.component.css']
})
export class PlayerResultsComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private apiService: BellumgensApiService) {
    this.route.params.subscribe(params => {
      if (params.query) {
        this.apiService.searchPlayers(params.query);
      }
    });
  }

  ngOnInit() {
  }

}
