import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { IgxButtonModule, IgxRippleModule, IgxToggleModule } from '@infragistics/igniteui-angular/directives';
import { IgxDropDownModule } from '@infragistics/igniteui-angular/drop-down';
import { IgxIconModule } from '@infragistics/igniteui-angular/icon';

import { LanguagesComponent } from './languages.component';

describe('LanguagesComponent', () => {
  let component: LanguagesComponent;
  let fixture: ComponentFixture<LanguagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [
        NoopAnimationsModule,
        IgxButtonModule,
        IgxIconModule,
        IgxRippleModule,
        IgxToggleModule,
        IgxDropDownModule,
        LanguagesComponent
    ]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
