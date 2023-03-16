import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { IgxNavigationDrawerModule,
  IgxNavbarModule,
  IgxLayoutModule,
  IgxRippleModule,
  IgxIconModule,
  IgxInputGroupModule,
  IgxBannerModule,
  IgxButtonModule,
  IgxAvatarModule,
  IgxProgressBarModule,
  IgxButtonGroupModule,
  IgxSliderModule,
  IgxDividerModule} from '@infragistics/igniteui-angular';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { CommonModule } from '@angular/common';
import { LanguagesComponent, LoginComponent, SuccessErrorComponent } from 'projects/common/src/public_api';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule,
        CommonModule,
        NoopAnimationsModule,
        ServiceWorkerModule.register('', { enabled: false }),
        IgxNavigationDrawerModule,
        IgxNavbarModule,
        IgxLayoutModule,
        IgxIconModule,
        IgxInputGroupModule,
        IgxBannerModule,
        IgxButtonModule,
        IgxNavbarModule,
        IgxAvatarModule,
        IgxRippleModule,
        IgxProgressBarModule,
        IgxButtonGroupModule,
        IgxSliderModule,
        IgxDividerModule,
        LanguagesComponent,
        LoginComponent,
        SuccessErrorComponent
      ],
      declarations: [AppComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });
});
