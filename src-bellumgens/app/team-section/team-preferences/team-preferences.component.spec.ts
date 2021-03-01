import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TeamPreferencesComponent } from './team-preferences.component';
import { IgxListModule, IgxIconModule, IgxSwitchModule, IgxInputGroupModule, IgxAvatarModule } from '@infragistics/igniteui-angular';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TEAM_PLACEHOLDER } from '../../../../src-common/models/csgoteam';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { BellumGensModule } from 'src-common/lib/components.module';

describe('TeamPreferencesComponent', () => {
  let component: TeamPreferencesComponent;
  let fixture: ComponentFixture<TeamPreferencesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterTestingModule,
        NoopAnimationsModule,
        HttpClientTestingModule,
        ServiceWorkerModule.register('', {enabled: false}),
        IgxListModule,
        IgxIconModule,
        IgxSwitchModule,
        IgxInputGroupModule,
        IgxInputGroupModule,
        IgxAvatarModule,
        BellumGensModule
      ],
      declarations: [
        TeamPreferencesComponent
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {
              params: new Observable()
            },
            data: new Observable()
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamPreferencesComponent);
    component = fixture.componentInstance;
    component.team = TEAM_PLACEHOLDER;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
