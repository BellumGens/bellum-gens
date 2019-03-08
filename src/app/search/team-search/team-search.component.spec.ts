import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamSearchComponent } from './team-search.component';
import { FormsModule } from '@angular/forms';
import { IgxRadioModule,
  IgxSliderModule,
  IgxDialogModule,
  IgxRippleModule,
  IgxAvatarModule,
  IgxIconModule,
  IgxDropDownModule,
  IgxToggleModule } from 'igniteui-angular';
import { LoginComponent } from 'src/app/login/login.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ServiceWorkerModule } from '@angular/service-worker';

describe('TeamSearchComponent', () => {
  let component: TeamSearchComponent;
  let fixture: ComponentFixture<TeamSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterTestingModule,
        NoopAnimationsModule,
        ServiceWorkerModule.register('', {enabled: false}),
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
        TeamSearchComponent,
        LoginComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
