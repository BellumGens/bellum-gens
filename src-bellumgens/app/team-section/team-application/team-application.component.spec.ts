import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamApplicationComponent } from './team-application.component';
import { IgxIconModule, IgxInputGroupModule, IgxDialogModule, IgxRippleModule } from '@infragistics/igniteui-angular';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TeamApplicationComponent', () => {
  let component: TeamApplicationComponent;
  let fixture: ComponentFixture<TeamApplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterTestingModule,
        NoopAnimationsModule,
        HttpClientTestingModule,
        IgxIconModule,
        IgxInputGroupModule,
        IgxDialogModule,
        IgxRippleModule
      ],
      declarations: [ TeamApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
