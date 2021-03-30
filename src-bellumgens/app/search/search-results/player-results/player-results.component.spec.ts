import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PlayerResultsComponent } from './player-results.component';
import { IgxProgressBarModule, IgxCardModule, IgxAvatarModule, IgxChipsModule, IgxIconModule } from '@infragistics/igniteui-angular';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { QueryParsedPipe } from 'src-bellumgens/app/pipes/query-parsed.pipe';
import { BellumGensModule } from 'src-common/lib/public_api';

describe('PlayerResultsComponent', () => {
  let component: PlayerResultsComponent;
  let fixture: ComponentFixture<PlayerResultsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        IgxProgressBarModule,
        IgxCardModule,
        IgxAvatarModule,
        IgxChipsModule,
        IgxIconModule,
        BellumGensModule
      ],
      declarations: [
        PlayerResultsComponent,
        QueryParsedPipe
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
