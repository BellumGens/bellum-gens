import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LoadingComponent } from './loading.component';

import { IgxProgressBarModule } from '@infragistics/igniteui-angular';

describe('LoadingComponent', () => {
  let component: LoadingComponent;
  let fixture: ComponentFixture<LoadingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    imports: [
        IgxProgressBarModule,
        LoadingComponent
    ]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
