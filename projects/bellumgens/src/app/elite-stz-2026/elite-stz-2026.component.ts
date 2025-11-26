import { Component, inject, Signal, WritableSignal, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';
import { EliteSignupService } from './elite-signup.service';
import { IgxInputGroupModule, IgxCheckboxModule, IgxButtonModule } from '@infragistics/igniteui-angular';

@Component({
  selector: 'bge-elite-stz-2026',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IgxInputGroupModule, IgxCheckboxModule, IgxButtonModule],
  templateUrl: './elite-stz-2026.component.html',
  styleUrls: ['./elite-stz-2026.component.scss']
})
export class EliteStz2026Component {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  private fb = inject(FormBuilder);
  private service: EliteSignupService = inject(EliteSignupService);

  count: WritableSignal<number> = signal(0);
  submitting = signal(false);
  submitSuccess = signal<boolean | null>(null);
  errorMsg = signal<string | null>(null);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    firstTime: [false]
  });

  isAuthenticated = this.service.isAuthenticated();

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.service.getSignupCount().subscribe({
        next: c => this.count.set(c ?? 0),
        error: () => this.count.set(0)
      });
    }
  }

  get discount(): number {
    const c = this.count();
    if (c > 500) return 33;
    if (c > 250) return 25;
    if (c > 0) return 15;
    return 0;
  }

  submit() {
    if (!this.isAuthenticated || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.errorMsg.set(null);
    const payload = {
      email: this.form.value.email as string,
      firstTime: !!this.form.value.firstTime
    };
    if (!isPlatformBrowser(this.platformId)) return;
    this.service.signup(payload).subscribe({
      next: () => {
        this.submitting.set(false);
        this.submitSuccess.set(true);
        this.service.getSignupCount().subscribe({
          next: c => this.count.set(c ?? 0)
        });
      },
      error: (e) => {
        this.submitting.set(false);
        this.submitSuccess.set(false);
        this.errorMsg.set('Failed to submit. Please try again later.');
        console.error(e);
      }
    });
  }
}
