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
  IgxDialogModule,
  IgxTabsModule,
  IgxInputGroupModule,
  IgxSwitchModule,
  IgxProgressBarModule,
  IgxDividerModule,
  IgxButtonModule,
  IgxSelectModule} from 'igniteui-angular';
import { PlayerSearchComponent } from '../player-search/player-search.component';
import { TeamSearchComponent } from '../team-search/team-search.component';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from 'src/app/login/login.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { UserPreferencesComponent } from 'src/app/player-section/user-preferences/user-preferences.component';
import { ConfirmComponent } from 'src/app/confirm/confirm.component';

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
        IgxAvatarModule,
        IgxSliderModule,
        IgxRippleModule,
        IgxInputGroupModule,
        IgxButtonModule,
        IgxSelectModule
      ],
      declarations: [
        SearchComponent,
        PlayerSearchComponent,
        TeamSearchComponent
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
