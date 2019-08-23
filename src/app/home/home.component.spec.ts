import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { IgxInputGroupModule,
  IgxIconModule,
  IgxAvatarModule,
  IgxProgressBarModule,
  IgxDividerModule,
  IgxButtonModule,
  IgxDialogModule} from 'igniteui-angular';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { LoginDialogComponent } from '../login/login-dialog/login-dialog.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        NoopAnimationsModule,
        RouterTestingModule,
        ServiceWorkerModule.register('', {enabled: false}),
        IgxInputGroupModule,
        IgxIconModule,
        IgxAvatarModule,
        IgxDividerModule,
        IgxProgressBarModule,
        IgxButtonModule,
        IgxDialogModule
      ],
      declarations: [
        HomeComponent,
        LoginDialogComponent
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
