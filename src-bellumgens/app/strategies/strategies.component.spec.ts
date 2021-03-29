import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StrategiesComponent } from './strategies.component';
import { IgxIconModule,
  IgxCardModule,
  IgxInputGroupModule,
  IgxRadioModule,
  IgxDialogModule,
  IgxToggleModule,
  IgxCheckboxModule,
  IgxChipsModule,
  IgxTimePickerModule,
  IgxSelectModule,
  IgxAvatarModule,
  IgxBadgeModule,
  IgxSwitchModule,
  IgxDropDownModule,
  IgxProgressBarModule,
  IgxButtonModule,
  IgxDividerModule} from '@infragistics/igniteui-angular';
import { SafeVideoLinkPipe } from 'src-bellumgens/app/pipes/safe-video-link.pipe';
import { FormsModule } from '@angular/forms';
import { SideStratsPipe } from 'src-bellumgens/app/pipes/sidestrats.pipe';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TruncateTextPipe } from 'src-bellumgens/app/pipes/truncate-text.pipe';
import { IsVideoPipe } from 'src-bellumgens/app/pipes/is-video.pipe';
import { ServiceWorkerModule } from '@angular/service-worker';
import { VotesPipe } from 'src-bellumgens/app/pipes/votes.pipe';
import { HasVotedPipe } from 'src-bellumgens/app/pipes/has-voted.pipe';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { NewStrategyComponent } from './new-strategy/new-strategy.component';
import { IsStratOwnerPipe } from 'src-bellumgens/app/pipes/is-strat-owner.pipe';
import { BellumGensModule } from 'src-common/lib/public_api';

describe('StrategiesComponent', () => {
  let component: StrategiesComponent;
  let fixture: ComponentFixture<StrategiesComponent>;

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
        IgxButtonModule,
        IgxDividerModule,
        BellumGensModule
      ],
      declarations: [
        StrategiesComponent,
        NewStrategyComponent,
        SafeVideoLinkPipe,
        SideStratsPipe,
        TruncateTextPipe,
        IsVideoPipe,
        VotesPipe,
        HasVotedPipe,
        IsStratOwnerPipe
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {
              parent: {
                params: new Observable()
              }
            },
            data: new Observable()
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
