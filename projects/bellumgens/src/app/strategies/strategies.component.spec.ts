import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StrategiesComponent } from './strategies.component';
import { IgxIconModule } from '@infragistics/igniteui-angular/icon';
import { IgxCardModule } from '@infragistics/igniteui-angular/card';
import { IgxInputGroupModule } from '@infragistics/igniteui-angular/input-group';
import { IgxRadioModule } from '@infragistics/igniteui-angular/radio';
import { IgxDialogModule } from '@infragistics/igniteui-angular/dialog';
import { IgxButtonModule, IgxDividerModule, IgxToggleModule } from '@infragistics/igniteui-angular/directives';
import { IgxCheckboxModule } from '@infragistics/igniteui-angular/checkbox';
import { IgxChipsModule } from '@infragistics/igniteui-angular/chips';
import { IgxTimePickerModule } from '@infragistics/igniteui-angular/time-picker';
import { IgxSelectModule } from '@infragistics/igniteui-angular/select';
import { IgxAvatarModule } from '@infragistics/igniteui-angular/avatar';
import { IgxBadgeModule } from '@infragistics/igniteui-angular/badge';
import { IgxSwitchModule } from '@infragistics/igniteui-angular/switch';
import { IgxDropDownModule } from '@infragistics/igniteui-angular/drop-down';
import { IgxProgressBarModule } from '@infragistics/igniteui-angular/progressbar';
import { SafeVideoLinkPipe } from 'projects/bellumgens/src/app/pipes/safe-video-link.pipe';
import { FormsModule } from '@angular/forms';
import { SideStratsPipe } from 'projects/bellumgens/src/app/pipes/sidestrats.pipe';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TruncateTextPipe } from 'projects/bellumgens/src/app/pipes/truncate-text.pipe';
import { IsVideoPipe } from 'projects/bellumgens/src/app/pipes/is-video.pipe';
import { ServiceWorkerModule } from '@angular/service-worker';
import { VotesPipe } from 'projects/bellumgens/src/app/pipes/votes.pipe';
import { HasVotedPipe } from 'projects/bellumgens/src/app/pipes/has-voted.pipe';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { NewStrategyComponent } from './new-strategy/new-strategy.component';
import { IsStratOwnerPipe } from 'projects/bellumgens/src/app/pipes/is-strat-owner.pipe';
import { StratFilterPipe } from '../pipes/strat-filter.pipe';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('StrategiesComponent', () => {
  let component: StrategiesComponent;
  let fixture: ComponentFixture<StrategiesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [FormsModule,
        RouterTestingModule,
        NoopAnimationsModule,
        ServiceWorkerModule.register('', { enabled: false }),
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
        StrategiesComponent,
        NewStrategyComponent,
        SafeVideoLinkPipe,
        SideStratsPipe,
        TruncateTextPipe,
        IsVideoPipe,
        VotesPipe,
        HasVotedPipe,
        IsStratOwnerPipe,
        StratFilterPipe],
    providers: [
        {
            provide: ActivatedRoute,
            useValue: {
                parent: {
                    parent: {
                        params: new Observable()
                    }
                },
                data: new Observable(),
                url: new Observable()
            }
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
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
