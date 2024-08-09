import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TeamApplicationComponent } from './team-application.component';
import { IgxIconModule, IgxInputGroupModule, IgxDialogModule, IgxRippleModule } from '@infragistics/igniteui-angular';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('TeamApplicationComponent', () => {
  let component: TeamApplicationComponent;
  let fixture: ComponentFixture<TeamApplicationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [FormsModule,
        RouterTestingModule,
        NoopAnimationsModule,
        IgxIconModule,
        IgxInputGroupModule,
        IgxDialogModule,
        IgxRippleModule,
        TeamApplicationComponent],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
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
