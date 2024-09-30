import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseDirective } from '../../base/base.component';

@Component({
  selector: 'app-visit-start-zagora',
  standalone: true,
  imports: [

  ],
  templateUrl: './visit-stara-zagora.component.html',
  styleUrl: './visit-stara-zagora.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VisitStaraZagoraComponent extends BaseDirective { }
