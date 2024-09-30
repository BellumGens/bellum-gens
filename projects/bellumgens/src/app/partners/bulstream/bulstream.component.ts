import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseDirective } from '../../base/base.component';

@Component({
  selector: 'app-bulstream',
  standalone: true,
  imports: [
  ],
  templateUrl: './bulstream.component.html',
  styleUrl: './bulstream.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BulstreamComponent extends BaseDirective { }
