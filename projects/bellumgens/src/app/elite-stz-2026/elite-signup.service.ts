import { Injectable, inject, Signal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LoginService } from 'projects/common/src/services/login.service';
import { BellumgensApiService } from 'projects/common/src/services/bellumgens-api.service';
import { environment } from 'projects/common/src/environments/environment';

export interface EliteSignupPayload {
  email: string;
  firstTime: boolean;
}

@Injectable({ providedIn: 'root' })
export class EliteSignupService {
  private http = inject(HttpClient);
  private auth = inject(LoginService);
  private api = inject(BellumgensApiService);

  isAuthenticated(): boolean {
    return !!this.auth.applicationUser.value;
  }

  getSignupCount(): Observable<number> {
    return this.http.get<{ count: number }>(`${environment.apiEndpoint}/elite/stz2026/count`, { withCredentials: true }).pipe(
      map(r => r?.count ?? 0),
      catchError(() => of(0))
    );
  }

  signup(payload: EliteSignupPayload): Observable<void> {
    return this.http.post<void>(`${environment.apiEndpoint}/elite/stz2026/signup`, payload, { withCredentials: true }).pipe(
      catchError((err) => {
        return of(void 0);
      })
    );
  }
}
