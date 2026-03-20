<<<<<<< HEAD
import { Injectable, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Customer } from '../models/customer.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = 'http://localhost:3000/api';
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  private _user = signal<Customer | null>(null);
  private _token = signal<string | null>(null);

  readonly user = this._user.asReadonly();
  readonly token = this._token.asReadonly();
  readonly isLoggedIn = computed(() => !!this._token());
  readonly isAdmin = computed(() => this._user()?.role === 'admin');

  constructor(private http: HttpClient, private router: Router) {
    if (this.isBrowser) {
      const token = localStorage.getItem('token');
      const stored = localStorage.getItem('user');
      if (token) this._token.set(token);
      if (stored) { try { this._user.set(JSON.parse(stored)); } catch {} }
    }
  }

  login(email: string, password: string) {
    return this.http.post<{ token: string; customer: Customer }>(
      `${this.API}/auth/login`, { email, password }
    );
  }

  register(data: any) {
    return this.http.post<{ token: string; customer: Customer }>(
      `${this.API}/auth/register`, data
    );
  }

  setSession(token: string, customer: Customer) {
    this._token.set(token);
    this._user.set(customer);
    if (this.isBrowser) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(customer));
    }
  }

  logout() {
    this._token.set(null);
    this._user.set(null);
    if (this.isBrowser) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    this.router.navigate(['/login']);
  }

  get currentCustomerId(): number | null {
    return this._user()?.id ?? null;
=======
import { Injectable, signal } from '@angular/core';

/** Simulates the currently logged-in customer session. */
@Injectable({ providedIn: 'root' })
export class AuthService {
  /** In a real app this would come from JWT / OAuth. */
  private readonly _currentCustomerId = signal<string>('c001');

  get currentCustomerId(): string {
    return this._currentCustomerId();
  }

  /** Switch the active user (for demo/testing purposes). */
  switchUser(id: string): void {
    this._currentCustomerId.set(id);
>>>>>>> cdfeec59ca7a141783b903c3730bcec6a04e3ce3
  }
}
