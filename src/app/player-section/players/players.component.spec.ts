import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { PlayersComponent } from './players.component';
import { IgxListModule, IgxAvatarModule, IgxIconModule, IgxInputGroupModule, IgxProgressBarModule } from 'igniteui-angular';
import { PlayerCountryPipe } from 'src/app/pipes/player-country.pipe';
import { RouterTestingModule } from '@angular/router/testing';

describe('PlayersComponent', () => {
  let component: PlayersComponent;
  let fixture: ComponentFixture<PlayersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PlayersComponent,
        PlayerCountryPipe
      ],
      imports: [
        FormsModule,
        RouterTestingModule,
        IgxListModule,
        IgxAvatarModule,
        IgxIconModule,
        IgxInputGroupModule,
        IgxProgressBarModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
