import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopComponent } from './shop.component';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IgxSelectModule, IgxInputGroupModule, IgxIconModule, IgxButtonModule, IgxMaskModule, IgxDividerModule } from '@infragistics/igniteui-angular';
import { FilterSizesPipe } from '../pipes/filter-sizes.pipe';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('ShopComponent', () => {
  let component: ShopComponent;
  let fixture: ComponentFixture<ShopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopComponent, FilterSizesPipe ],
      imports: [
        FormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        NoopAnimationsModule,
        IgxSelectModule,
        IgxInputGroupModule,
        IgxIconModule,
        IgxButtonModule,
        IgxMaskModule,
        IgxDividerModule
      ]
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
