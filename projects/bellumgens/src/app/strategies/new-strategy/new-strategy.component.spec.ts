import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NewStrategyComponent } from './new-strategy.component';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { IgxDialogModule } from '@infragistics/igniteui-angular/dialog';
import { IgxInputGroupModule } from '@infragistics/igniteui-angular/input-group';
import { IgxIconModule } from '@infragistics/igniteui-angular/icon';
import { IgxRadioModule } from '@infragistics/igniteui-angular/radio';
import { IgxSwitchModule } from '@infragistics/igniteui-angular/switch';
import { IgxSelectModule } from '@infragistics/igniteui-angular/select';
import { SafeVideoLinkPipe } from 'projects/bellumgens/src/app/pipes/safe-video-link.pipe';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('NewStrategyComponent', () => {
  let component: NewStrategyComponent;
  let fixture: ComponentFixture<NewStrategyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [FormsModule,
        RouterTestingModule,
        NoopAnimationsModule,
        IgxDialogModule,
        IgxInputGroupModule,
        IgxIconModule,
        IgxRadioModule,
        IgxSwitchModule,
        IgxSelectModule,
        NewStrategyComponent,
        SafeVideoLinkPipe],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewStrategyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
