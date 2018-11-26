import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { PlayersComponent } from './players.component';
import { IgxListModule, IgxAvatarModule, IgxIconModule, IgxFilterModule, IgxInputGroupModule } from 'igniteui-angular/main';

describe('PlayersComponent', () => {
  let component: PlayersComponent;
  let fixture: ComponentFixture<PlayersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PlayersComponent],
      imports: [ FormsModule, IgxListModule, IgxAvatarModule, IgxIconModule, IgxFilterModule, IgxInputGroupModule ]
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
