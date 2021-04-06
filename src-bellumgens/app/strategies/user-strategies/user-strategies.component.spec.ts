import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UserStrategiesComponent } from './user-strategies.component';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { IgxIconModule,
  IgxAvatarModule,
  IgxCardModule,
  IgxInputGroupModule,
  IgxRadioModule,
  IgxToggleModule,
  IgxSelectModule,
  IgxDialogModule,
  IgxCheckboxModule,
  IgxChipsModule,
  IgxTimePickerModule,
  IgxBadgeModule,
  IgxSwitchModule,
  IgxDropDownModule,
  IgxProgressBarModule } from '@infragistics/igniteui-angular';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SafeVideoLinkPipe } from 'src-bellumgens/app/pipes/safe-video-link.pipe';
import { TruncateTextPipe } from 'src-bellumgens/app/pipes/truncate-text.pipe';
import { IsVideoPipe } from 'src-bellumgens/app/pipes/is-video.pipe';
import { BellumGensModule, ConfirmModule } from 'src-common/lib/public_api';
import { NewStrategyComponent } from '../new-strategy/new-strategy.component';

describe('UserStrategiesComponent', () => {
  let component: UserStrategiesComponent;
  let fixture: ComponentFixture<UserStrategiesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterTestingModule,
        NoopAnimationsModule,
        HttpClientTestingModule,
        ServiceWorkerModule.register('', {enabled: false}),
        IgxIconModule,
        IgxAvatarModule,
        IgxCardModule,
        IgxInputGroupModule,
        IgxRadioModule,
        IgxToggleModule,
        IgxSelectModule,
        IgxDialogModule,
        IgxCheckboxModule,
        IgxChipsModule,
        IgxTimePickerModule,
        IgxBadgeModule,
        IgxSwitchModule,
        IgxDropDownModule,
        IgxProgressBarModule,
        BellumGensModule,
        ConfirmModule
      ],
      declarations: [
        UserStrategiesComponent,
        NewStrategyComponent,
        SafeVideoLinkPipe,
        TruncateTextPipe,
        IsVideoPipe
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserStrategiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
