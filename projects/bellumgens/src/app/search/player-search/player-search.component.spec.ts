import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PlayerSearchComponent } from './player-search.component';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { IgxRadioModule } from '@infragistics/igniteui-angular/radio';
import { IgxSliderModule } from '@infragistics/igniteui-angular/slider';
import { IgxButtonModule, IgxRippleModule } from '@infragistics/igniteui-angular/directives';
import { IgxAvatarModule } from '@infragistics/igniteui-angular/avatar';
import { IgxIconModule } from '@infragistics/igniteui-angular/icon';
import { IgxInputGroupModule } from '@infragistics/igniteui-angular/input-group';
import { IgxSelectModule } from '@infragistics/igniteui-angular/select';
import { ServiceWorkerModule } from '@angular/service-worker';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('PlayerSearchComponent', () => {
  let component: PlayerSearchComponent;
  let fixture: ComponentFixture<PlayerSearchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [FormsModule,
        RouterTestingModule,
        NoopAnimationsModule,
        ServiceWorkerModule.register('', { enabled: false }),
        IgxRadioModule,
        IgxSliderModule,
        IgxRippleModule,
        IgxAvatarModule,
        IgxIconModule,
        IgxSelectModule,
        IgxInputGroupModule,
        IgxButtonModule,
        PlayerSearchComponent],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
