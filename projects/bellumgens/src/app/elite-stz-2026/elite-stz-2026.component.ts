import { Component, inject, WritableSignal, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, OnInit } from '@angular/core';
import { ApplicationUser, BellumgensApiService, CommunicationService, LoginService } from '../../../../common/src/public_api';
import { IgxButtonDirective } from '@infragistics/igniteui-angular/directives';
import { IgxCheckboxComponent } from '@infragistics/igniteui-angular/checkbox';
import { IgxInputDirective, IgxInputGroupComponent, IgxLabelDirective } from '@infragistics/igniteui-angular/input-group';
import { EarlyBird } from '../../../../common/src/models/subscribers';

@Component({
  selector: 'bge-elite-stz-2026',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IgxInputGroupComponent,
    IgxInputDirective,
    IgxLabelDirective,
    IgxCheckboxComponent,
    IgxButtonDirective
  ],
  templateUrl: './elite-stz-2026.component.html',
  styleUrls: ['./elite-stz-2026.component.scss']
})
export class EliteStz2026Component implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private fb = inject(FormBuilder);
  private commService = inject(CommunicationService);
  private authService = inject(LoginService);
  private apiService = inject(BellumgensApiService);

  public count: WritableSignal<number> = signal(0);
  public submitting = signal(false);

  public form = this.fb.group({
    email: [{value: '', disabled: true}, [Validators.required, Validators.email]],
    firstTime: [{value: false, disabled: true}],
    agreePrivacy: [{value: false, disabled: true}, [Validators.requiredTrue]]
  });

  public authUser: ApplicationUser | null = null;

  constructor() {
    this.authService.applicationUser.subscribe(user => {
      this.authUser = user;
      if (user) {
        this.form.get('email')?.enable();
        this.form.get('firstTime')?.enable();
        this.form.get('agreePrivacy')?.enable();
        if (user.email) {
          this.form.patchValue({ email: user.email });
        }
      }
    });
  }

  public ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.apiService.getSignupCount().subscribe({
        next: c => this.count.set(c ?? 0),
        error: () => this.count.set(0)
      });
    }
  }

  public get discount(): number {
    const c = this.count();
    if (c > 500) return 33;
    if (c > 250) return 25;
    if (c > 100) return 15;
    if (c > 0) return 10;
    return 0;
  }

  public submit() {
    if (!this.authUser || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    const payload: EarlyBird = {
      email: this.form.value.email as string,
      firstTime: !!this.form.value.firstTime
    };
    if (!isPlatformBrowser(this.platformId)) return;
    this.apiService.earlyBirdSignup(payload).subscribe({
      next: () => {
        this.submitting.set(false);
        this.apiService.getSignupCount().subscribe({
          next: c => this.count.set(c ?? 0)
        });
      },
      error: (e) => {
        this.submitting.set(false);
        this.commService.emitError(e.message || `An error occurred while submitting your pre-registration. Please try again later.`);
      }
    });
  }
}
