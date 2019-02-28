import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerSearchComponent } from './player-search.component';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { IgxRadioModule,
  IgxSliderModule,
  IgxDialogModule,
  IgxRippleModule,
  IgxAvatarModule,
  IgxIconModule,
  IgxToggleModule,
  IgxDropDownModule } from 'igniteui-angular';
import { LoginComponent } from 'src/app/login/login.component';

describe('PlayerSearchComponent', () => {
  let component: PlayerSearchComponent;
  let fixture: ComponentFixture<PlayerSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterTestingModule,
        NoopAnimationsModule,
        IgxRadioModule,
        IgxSliderModule,
        IgxDialogModule,
        IgxRippleModule,
        IgxAvatarModule,
        IgxIconModule,
        IgxToggleModule,
        IgxDropDownModule
      ],
      declarations: [
        PlayerSearchComponent,
        LoginComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
