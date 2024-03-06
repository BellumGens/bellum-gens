import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BaseComponent } from './base.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('BaseComponent', () => {
  let component: BaseComponent;
  let fixture: ComponentFixture<BaseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        BaseComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component['_title']).toBe('Bellum Gens: Premier Gaming and Esports Events Organizer');
    expect(component['_twitterTitle']).toBe('Bellum Gens: Premier Gaming and Esports Events Organizer');
    expect(component['_description']).toBe('Bellum Gens is a premier gaming and esports events organizer in Bulgaria and the Balkans region. If you want to tap into esports we can help!');
    expect(component['_twitterDescription']).toBe('Bellum Gens is a premier gaming and esports events organizer in Bulgaria and the Balkans region.');
    expect(component['_image']).toBe('/assets/avatar_BG_blood.png');
  });
});
