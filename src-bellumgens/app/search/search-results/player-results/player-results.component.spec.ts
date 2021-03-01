import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PlayerResultsComponent } from './player-results.component';
import { IgxProgressBarModule, IgxCardModule, IgxAvatarModule, IgxChipsModule, IgxIconModule } from '@infragistics/igniteui-angular';
import { DaysAvailablePipe } from 'src-bellumgens/app/pipes/days-available.pipe';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { QueryParsedPipe } from 'src-bellumgens/app/pipes/query-parsed.pipe';
import { BellumGensModule } from 'src-common/lib/components.module';

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
        DaysAvailablePipe,
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
