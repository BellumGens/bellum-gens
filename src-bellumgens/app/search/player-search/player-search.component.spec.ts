import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerSearchComponent } from './player-search.component';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { IgxRadioModule,
  IgxSliderModule,
  IgxRippleModule,
  IgxAvatarModule,
  IgxIconModule,
  IgxInputGroupModule,
  IgxButtonModule,
  IgxSelectModule} from '@infragistics/igniteui-angular';
import { ServiceWorkerModule } from '@angular/service-worker';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('PlayerSearchComponent', () => {
  let component: PlayerSearchComponent;
  let fixture: ComponentFixture<PlayerSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterTestingModule,
        NoopAnimationsModule,
        HttpClientTestingModule,
        ServiceWorkerModule.register('', {enabled: false}),
        IgxRadioModule,
        IgxSliderModule,
        IgxRippleModule,
        IgxAvatarModule,
        IgxIconModule,
        IgxSelectModule,
        IgxInputGroupModule,
        IgxButtonModule
      ],
      declarations: [
        PlayerSearchComponent
      ]
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
