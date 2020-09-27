import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TournamentFormatComponent } from './tournament-format.component';
import { IgxDividerModule } from '@infragistics/igniteui-angular';

describe('TournamentFormatComponent', () => {
  let component: TournamentFormatComponent;
  let fixture: ComponentFixture<TournamentFormatComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ IgxDividerModule ],
      declarations: [ TournamentFormatComponent ]
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
