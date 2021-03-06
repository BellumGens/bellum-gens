import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StrategyDetailsComponent } from './strategy-details.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { IgxCardModule,
  IgxIconModule,
  IgxListModule,
  IgxInputGroupModule,
  IgxDividerModule,
  IgxAvatarModule,
  IgxProgressBarModule,
  IgxDropDownModule,
  IgxToggleModule,
  IgxDialogModule,
  IgxButtonModule} from '@infragistics/igniteui-angular';
import { VotesPipe } from 'src-bellumgens/app/pipes/votes.pipe';
import { IsVideoPipe } from 'src-bellumgens/app/pipes/is-video.pipe';
import { SafeVideoLinkPipe } from 'src-bellumgens/app/pipes/safe-video-link.pipe';
import { FormsModule } from '@angular/forms';
import { HasVotedPipe } from 'src-bellumgens/app/pipes/has-voted.pipe';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { BellumGensModule, ConfirmModule, LoadingModule } from 'src-common/lib/public_api';

describe('StrategyDetailsComponent', () => {
  let component: StrategyDetailsComponent;
  let fixture: ComponentFixture<StrategyDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        NoopAnimationsModule,
        FormsModule,
        ServiceWorkerModule.register('', {enabled: false}),
        IgxCardModule,
        IgxIconModule,
        IgxListModule,
        IgxInputGroupModule,
        IgxDividerModule,
        IgxAvatarModule,
        IgxProgressBarModule,
        IgxDropDownModule,
        IgxToggleModule,
        IgxDialogModule,
        IgxButtonModule,
        BellumGensModule,
        ConfirmModule,
        LoadingModule
      ],
      declarations: [
        StrategyDetailsComponent,
        VotesPipe,
        IsVideoPipe,
        SafeVideoLinkPipe,
        HasVotedPipe
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
