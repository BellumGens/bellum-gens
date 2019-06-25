import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickSearchComponent } from './quick-search.component';
import { IgxProgressBarModule, IgxListModule, IgxAvatarModule, IgxIconModule } from 'igniteui-angular';
import { RouterTestingModule } from '@angular/router/testing';
import { ReduceQuickSearchResultPipe } from 'src/app/pipes/reduce-quick-search-result.pipe';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PlayerCountryPipe } from 'src/app/pipes/player-country.pipe';

describe('QuickSearchComponent', () => {
  let component: QuickSearchComponent;
  let fixture: ComponentFixture<QuickSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        IgxProgressBarModule,
        IgxListModule,
        IgxAvatarModule,
        IgxIconModule
      ],
      declarations: [
        QuickSearchComponent,
        ReduceQuickSearchResultPipe,
        PlayerCountryPipe
      ]
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
