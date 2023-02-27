import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IgxCardModule, IgxDividerModule } from '@infragistics/igniteui-angular';

import { TournamentsMainComponent } from './tournaments-main.component';

describe('TournamentsMainComponent', () => {
  let component: TournamentsMainComponent;
  let fixture: ComponentFixture<TournamentsMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [
        HttpClientTestingModule,
        IgxDividerModule,
        IgxCardModule,
        TournamentsMainComponent
    ]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TournamentsMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
