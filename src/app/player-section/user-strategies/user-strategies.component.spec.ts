import { async, ComponentFixture, TestBed } from '@angular/core/testing';

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
  IgxProgressBarModule } from 'igniteui-angular';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmComponent } from 'src/app/confirm/confirm.component';
import { SafeVideoLinkPipe } from 'src/app/pipes/safe-video-link.pipe';
import { TruncateTextPipe } from 'src/app/pipes/truncate-text.pipe';
import { IsVideoPipe } from 'src/app/pipes/is-video.pipe';
import { NewStrategyComponent } from 'src/app/team-section/team-strategies/new-strategy/new-strategy.component';

describe('UserStrategiesComponent', () => {
  let component: UserStrategiesComponent;
  let fixture: ComponentFixture<UserStrategiesComponent>;

  beforeEach(async(() => {
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
        IgxProgressBarModule
      ],
      declarations: [
        UserStrategiesComponent,
        NewStrategyComponent,
        ConfirmComponent,
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
