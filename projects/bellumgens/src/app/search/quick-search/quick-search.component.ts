import { Component, computed, inject, PLATFORM_ID } from '@angular/core';
import { DecimalPipe, isPlatformBrowser } from '@angular/common';
import { SearchResult, ApiSearchService } from '../../../../../common/src/public_api';
import { IgxIconComponent, IgxIconService } from '@infragistics/igniteui-angular/icon';
import { IGX_LIST_DIRECTIVES } from '@infragistics/igniteui-angular/list';
import { IgxAvatarComponent } from '@infragistics/igniteui-angular/avatar';
import { IgxButtonDirective, IgxRippleDirective } from '@infragistics/igniteui-angular/directives';
import { IgxCircularProgressBarComponent } from '@infragistics/igniteui-angular/progressbar';
import { ReduceQuickSearchResultPipe } from '../../pipes/reduce-quick-search-result.pipe';
import { CountrySVGPipe } from '../../../../../common/src/lib/pipes/country-svg.pipe';
import { RouterLink } from '@angular/router';

const EMPTY_SEARCH_RESULT: SearchResult = { steamUser: null, players: [], teams: [], strategies: [] };

@Component({
  selector: 'app-quick-search',
  templateUrl: './quick-search.component.html',
  styleUrls: ['./quick-search.component.scss'],  imports: [
    IGX_LIST_DIRECTIVES,
    IgxCircularProgressBarComponent,
    RouterLink,
    IgxAvatarComponent,
    IgxIconComponent,
    IgxButtonDirective,
    IgxRippleDirective,
    DecimalPipe,
    CountrySVGPipe,
    ReduceQuickSearchResultPipe
  ]
})
export class QuickSearchComponent {
  private apiService = inject(ApiSearchService);
  private iconService = inject(IgxIconService);
  private platformId = inject(PLATFORM_ID);

  public searchResult = computed<SearchResult>(() => this.apiService.searchResult() ?? EMPTY_SEARCH_RESULT);
  public loading = this.apiService.loadingQuickSearch;
  public term = computed(() => this.apiService.searchTerm() ?? '');

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.iconService.addSvgIcon('headshot', '/assets/headshot24x24.svg', 'weapon-icons');
    }
  }
}
