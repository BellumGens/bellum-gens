import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TournamentFormatComponent } from './tournament-format.component';
import { IgxDividerDirective } from '@infragistics/igniteui-angular';
import { RouterTestingModule } from '@angular/router/testing';

describe('TournamentFormatComponent', () => {
  let component: TournamentFormatComponent;
  let fixture: ComponentFixture<TournamentFormatComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [IgxDividerDirective, TournamentFormatComponent, RouterTestingModule]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentFormatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
