import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [
        FormsModule,
        NoopAnimationsModule,
        ServiceWorkerModule.register('', { enabled: false }),
        AppComponent],
    providers: [provideRouter([]), provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()]
}).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should track the search term and clear it', () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('#searchInput');
    input.value = 'bellum';
    input.dispatchEvent(new Event('input'));
    expect(component.searchTerm()).toBe('bellum');

    component.clearSearch();
    expect(component.searchTerm()).toBe('');
    expect(input.value).toBe('');
  });
});
