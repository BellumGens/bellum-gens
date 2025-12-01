import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QuickSearchComponent } from './quick-search.component';
import { IgxProgressBarModule } from '@infragistics/igniteui-angular/progressbar';
import { IgxListModule } from '@infragistics/igniteui-angular/list';
import { IgxAvatarModule } from '@infragistics/igniteui-angular/avatar';
import { IgxIconModule } from '@infragistics/igniteui-angular/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { ReduceQuickSearchResultPipe } from 'projects/bellumgens/src/app/pipes/reduce-quick-search-result.pipe';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('QuickSearchComponent', () => {
  let component: QuickSearchComponent;
  let fixture: ComponentFixture<QuickSearchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [RouterTestingModule,
        IgxProgressBarModule,
        IgxListModule,
        IgxAvatarModule,
        IgxIconModule,
        QuickSearchComponent,
        ReduceQuickSearchResultPipe],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
