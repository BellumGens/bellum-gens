import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentSc2Component } from './tournament-sc2.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { IgxAvatarModule, IgxCardModule } from 'igniteui-angular';

describe('TournamentSc2Component', () => {
  let component: TournamentSc2Component;
  let fixture: ComponentFixture<TournamentSc2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TournamentSc2Component ],
      imports: [
        HttpClientTestingModule,
        NoopAnimationsModule,
        ServiceWorkerModule.register('', {enabled: false}),
        IgxAvatarModule,
        IgxCardModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentSc2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
