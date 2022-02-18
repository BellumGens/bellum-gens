import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { IgxButtonModule, IgxDropDownModule, IgxIconModule, IgxRippleModule, IgxToggleModule } from '@infragistics/igniteui-angular';

import { LanguagesComponent } from './languages.component';

describe('LanguagesComponent', () => {
  let component: LanguagesComponent;
  let fixture: ComponentFixture<LanguagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LanguagesComponent ],
      imports: [
        NoopAnimationsModule,
        IgxButtonModule,
        IgxIconModule,
        IgxRippleModule,
        IgxToggleModule,
        IgxDropDownModule
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
