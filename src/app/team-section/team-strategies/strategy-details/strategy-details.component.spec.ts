import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyDetailsComponent } from './strategy-details.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { IgxCardModule } from 'igniteui-angular';

describe('StrategyDetailsComponent', () => {
  let component: StrategyDetailsComponent;
  let fixture: ComponentFixture<StrategyDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        ServiceWorkerModule.register('', {enabled: false}),
        IgxCardModule
      ],
      declarations: [ StrategyDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
