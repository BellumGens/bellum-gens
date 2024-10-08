import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ShopComponent } from './shop.component';
import { FormsModule } from '@angular/forms';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import {
  IgxSelectModule,
  IgxInputGroupModule,
  IgxIconModule,
  IgxButtonModule,
  IgxMaskModule,
  IgxDividerModule,
  IgxTextSelectionModule
} from '@infragistics/igniteui-angular';
import { FilterSizesPipe } from '../pipes/filter-sizes.pipe';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ShopComponent', () => {
  let component: ShopComponent;
  let fixture: ComponentFixture<ShopComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [FormsModule,
        RouterTestingModule,
        NoopAnimationsModule,
        IgxSelectModule,
        IgxInputGroupModule,
        IgxIconModule,
        IgxButtonModule,
        IgxMaskModule,
        IgxDividerModule,
        IgxTextSelectionModule,
        ShopComponent, FilterSizesPipe],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
