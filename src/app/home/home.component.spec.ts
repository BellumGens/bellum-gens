import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { IgxInputGroupModule, IgxIconModule, IgxCardModule, IgxListModule, IgxAvatarModule, IgxProgressBarModule } from 'igniteui-angular';
import { PlayersComponent } from '../player-section/players/players.component';
import { PlayerCountryPipe } from '../pipes/player-country.pipe';
import { RouterTestingModule } from '@angular/router/testing';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        IgxInputGroupModule,
        IgxIconModule,
        IgxCardModule,
        IgxListModule,
        IgxAvatarModule,
        IgxProgressBarModule
      ],
      declarations: [
        HomeComponent,
        PlayersComponent,
        PlayerCountryPipe
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
