import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { IgxButtonDirective, IgxRippleDirective, IgxToggleActionDirective, IgxToggleDirective, IGX_DROP_DOWN_DIRECTIVES, IgxIconComponent } from '@infragistics/igniteui-angular';

import { LanguagesComponent } from './languages.component';

describe('LanguagesComponent', () => {
  let component: LanguagesComponent;
  let fixture: ComponentFixture<LanguagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [
        NoopAnimationsModule,
        IgxButtonDirective,
        IgxIconComponent,
        IgxRippleDirective,
        IgxToggleActionDirective,
        IgxToggleDirective,
        IGX_DROP_DOWN_DIRECTIVES,
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
