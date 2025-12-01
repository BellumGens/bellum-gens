import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { IgxNavigationDrawerModule } from '@infragistics/igniteui-angular/navigation-drawer';
import { IgxNavbarModule } from '@infragistics/igniteui-angular/navbar';
import { IgxButtonModule, IgxDividerModule, IgxLayoutModule, IgxRippleModule } from '@infragistics/igniteui-angular/directives';
import { IgxIconModule } from '@infragistics/igniteui-angular/icon';
import { IgxInputGroupModule } from '@infragistics/igniteui-angular/input-group';
import { IgxBannerModule } from '@infragistics/igniteui-angular/banner';
import { IgxAvatarModule } from '@infragistics/igniteui-angular/avatar';
import { IgxProgressBarModule } from '@infragistics/igniteui-angular/progressbar';
import { IgxButtonGroupModule } from '@infragistics/igniteui-angular/button-group';
import { IgxSliderModule } from '@infragistics/igniteui-angular/slider';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { LanguagesComponent, LoginComponent, SuccessErrorComponent } from 'projects/common/src/public_api';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [RouterTestingModule,
        FormsModule,
        CommonModule,
        NgOptimizedImage,
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
        SuccessErrorComponent,
        AppComponent],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
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
