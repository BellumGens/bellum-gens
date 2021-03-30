import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TeamResultsComponent } from './team-results.component';
import { IgxProgressBarModule, IgxCardModule, IgxAvatarModule } from '@infragistics/igniteui-angular';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { QueryParsedPipe } from 'src-bellumgens/app/pipes/query-parsed.pipe';
import { BellumGensModule } from 'src-common/lib/public_api';

describe('TeamResultsComponent', () => {
  let component: TeamResultsComponent;
  let fixture: ComponentFixture<TeamResultsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        IgxProgressBarModule,
        IgxCardModule,
        IgxAvatarModule,
        BellumGensModule
      ],
      declarations: [
        TeamResultsComponent,
        QueryParsedPipe
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
