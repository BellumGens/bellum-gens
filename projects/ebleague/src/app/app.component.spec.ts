import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { IgxNavigationDrawerComponent, IgxNavDrawerTemplateDirective, IgxNavDrawerItemDirective, IgxNavDrawerMiniTemplateDirective, IgxNavbarComponent, IgxNavbarActionDirective, IgxButtonDirective, IgxDividerDirective, IgxLayoutDirective, IgxFlexDirective, IgxRippleDirective, IgxIconComponent, IGX_INPUT_GROUP_DIRECTIVES, IgxBannerComponent, IgxBannerActionsDirective, IgxAvatarComponent, IgxCircularProgressBarComponent, IgxButtonGroupComponent, IGX_SLIDER_DIRECTIVES } from '@infragistics/igniteui-angular';
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
        IgxNavigationDrawerComponent,
        IgxNavDrawerTemplateDirective,
        IgxNavDrawerItemDirective,
        IgxNavDrawerMiniTemplateDirective,
        IgxNavbarComponent,
        IgxNavbarActionDirective,
        IgxLayoutDirective,
        IgxFlexDirective,
        IgxIconComponent,
        IGX_INPUT_GROUP_DIRECTIVES,
        IgxBannerComponent,
        IgxBannerActionsDirective,
        IgxButtonDirective,
        IgxAvatarComponent,
        IgxRippleDirective,
        IgxCircularProgressBarComponent,
        IgxButtonGroupComponent,
        IGX_SLIDER_DIRECTIVES,
        IgxDividerDirective,
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
