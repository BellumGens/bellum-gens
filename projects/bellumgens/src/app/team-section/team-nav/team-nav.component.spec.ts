import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TeamNavComponent } from './team-nav.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TeamNewComponent } from '../team-new/team-new.component';

describe('TeamNavComponent', () => {
  let component: TeamNavComponent;
  let fixture: ComponentFixture<TeamNavComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        NoopAnimationsModule,
        HttpClientTestingModule,
        TeamNewComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
