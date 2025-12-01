import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IGX_CARD_DIRECTIVES, IgxDividerDirective } from '@infragistics/igniteui-angular';

import { TournamentsMainComponent } from './tournaments-main.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('TournamentsMainComponent', () => {
  let component: TournamentsMainComponent;
  let fixture: ComponentFixture<TournamentsMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [IgxDividerDirective,
        IGX_CARD_DIRECTIVES,
        TournamentsMainComponent],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
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
