import { async, ComponentFixture, TestBed } from '@angular/core/testing';

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
  IgxDialogModule} from 'igniteui-angular';
import { VotesPipe } from 'src/app/pipes/votes.pipe';
import { IsVideoPipe } from 'src/app/pipes/is-video.pipe';
import { SafeVideoLinkPipe } from 'src/app/pipes/safe-video-link.pipe';
import { FormsModule } from '@angular/forms';
import { AppShellComponent } from 'src/app/app-shell/app-shell.component';
import { HasVotedPipe } from 'src/app/pipes/has-voted.pipe';
import { ConfirmComponent } from 'src/app/confirm/confirm.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('StrategyDetailsComponent', () => {
  let component: StrategyDetailsComponent;
  let fixture: ComponentFixture<StrategyDetailsComponent>;

  beforeEach(async(() => {
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
        IgxDialogModule
      ],
      declarations: [
        StrategyDetailsComponent,
        AppShellComponent,
        ConfirmComponent,
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
