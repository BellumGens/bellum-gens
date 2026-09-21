import { ChangeDetectionStrategy, Component, inject, PLATFORM_ID, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
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

@Component({
  selector: 'app-quick-search',
  templateUrl: './quick-search.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  public searchResult = signal<SearchResult>({ steamUser: null, players: [], teams: [], strategies: [] });
  public loading = toSignal(this.apiService.loadingQuickSearch, { initialValue: false });
  public term = toSignal(this.apiService.searchTerm, { initialValue: '' });

  constructor() {
    this.apiService.searchResult.subscribe(data => {
      if (data) {
        this.searchResult.set(data);
      }
    });
    if (isPlatformBrowser(this.platformId)) {
      this.iconService.addSvgIcon('headshot', '/assets/headshot24x24.svg', 'weapon-icons');
    }
  }
}
