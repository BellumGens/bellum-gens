import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchComponent } from './search.component';
import { IgxButtonGroupModule,
  IgxRippleModule,
  IgxRadioModule,
  IgxIconModule,
  IgxToggleModule,
  IgxDropDownModule,
  IgxAvatarModule,
  IgxSliderModule,
  IgxDialogModule} from 'igniteui-angular';
import { PlayerSearchComponent } from '../player-search/player-search.component';
import { TeamSearchComponent } from '../team-search/team-search.component';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from 'src/app/login/login.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterTestingModule,
        NoopAnimationsModule,
        IgxButtonGroupModule,
        IgxRippleModule,
        IgxRadioModule,
        IgxIconModule,
        IgxToggleModule,
        IgxDropDownModule,
        IgxAvatarModule,
        IgxSliderModule,
        IgxDialogModule,
        IgxRippleModule
      ],
      declarations: [
        SearchComponent,
        PlayerSearchComponent,
        TeamSearchComponent,
        LoginComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
